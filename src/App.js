import React, {useState, useRef, useEffect, useCallback, createContext} from 'react';
import Styled from 'styled-components';
import List from './components/List';
import { useObjectMap } from './Hook';
import './App.css';

const databaseName = `sanguk-db`;
const tableName = `default-rtdb`;
const databaseURL = `https://${databaseName}-${tableName}.firebaseio.com`;
export const funcContext = createContext();

function App() {
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [todoList, setTodoList] = useState({});
  const input = useRef(null);

  const _getTodoList = useCallback(() => {
    fetch(`${databaseURL}/todoList.json`).then(res => {
      if (res.status !== 200) {
        console.log('서버에러!!');
        return false;
      }
      return res.json();
    }).then(data => {
      data = data ?? [];
      setTodoList(data);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    });
  }, []);

  const _postTodoList = useCallback((newData) => {
    return fetch(`${databaseURL}/todoList.json`, {
      method: 'POST',
      body: JSON.stringify(newData)
    }).then(res => {
      if (res.status !== 200) {
        console.log('서버에러!!');
        return false;
      }
      return res.json();
    }).then(data => {
      todoList[data.name] = newData;
      setTodoList(todoList);
      _getTodoList();
    });
  }, [_getTodoList, todoList]);

  const _putTodoList = useCallback((id, newData) => {
    return fetch(`${databaseURL}/todoList/${id}.json`, {
      method: 'PUT',
      body: JSON.stringify(newData)
    }).then(res => {
      if (res.status !== 200) {
        console.log('서버에러!!');
        return false;
      }
      return res.json();
    }).then(data => {
      _getTodoList();
    });
  }, [_getTodoList])

  const _deleteTodoList = useCallback((id) => {
    return fetch(`${databaseURL}/todoList/${id}.json`, {
      method: 'DELETE'
    }).then(res => {
      if (res.status !== 200) {
        console.log('서버에러!!');
        return false;
      }
      return res.json();
    }).then(() => {
      _getTodoList();
    })
  }, [_getTodoList]);
  
  const inputChange = (e) => {    // input
    let val = e.currentTarget.value;
    setValue(val.length);
  }
  const inputSubmit = (e) => {    // button
    e.preventDefault();
    let val = input.current.value;
    if (val === '') return;
    _postTodoList({ text: val, complete: false });
    input.current.value = '';
    setValue(0);
  }

  useEffect(() => {
    _getTodoList();
  }, [_getTodoList]);

  return (
    <Wrap>
      <Logo />
      <Form>
        <Input ref={ input } maxLength="29" onChange={ inputChange } />
        <Submit onClick={ inputSubmit } />
        <InputInfo>가능한 자리 수 : { value }/30 자리</InputInfo>
      </Form>
      <funcContext.Provider value={ { setTodoList, _putTodoList, _deleteTodoList } }>
        <Todo>
          {useObjectMap(todoList).map((data, idx) => {
            let loadingEl = 
              <div key={ data[0] } style={ { display: idx ? 'none' : 'block' } } >
                <OutLine><InLine /></OutLine><LoadingText>로딩중..</LoadingText>
              </div>;
            let notLoadingEl = 
              <List key={ data[0] } keyName={ data[0] } value={ data[1] } />

            return (loading ? loadingEl : notLoadingEl);
          })}
        </Todo>
      </funcContext.Provider>
    </Wrap>
  );
}

export default App;

const Wrap = Styled.div`
  width: 60%;
  min-width: 320px;
  height: 100%;
  margin: 0 auto;
  border-left: 1px solid #444;
  border-right: 1px solid #444;
`;
const Logo = Styled.h1`
  text-align: center;
  color: #999;
  font-weight: 400;
  letter-spacing: 2px;
  margin: 0 auto 30px;
  padding-top: 10px;
  ::before {
    content: 'To Do List';
  }
`;
const Form = Styled.form`
  display: flex;
  align-items: center;
  jstify-content: center;
  flex-wrap: wrap;
`;
const Input = Styled.input`
  width: calc(100% - 80px);
  height: 32px;
  margin-right: 10px;
  padding: 0 5px;
`;
const Submit = Styled.button`
  width: 70px;
  height: 32px;
  cursor: pointer;
  color: #999;
  background-color: #333;
  border: 1px solid #666;
  ::before {
    content: '등 록';
  }
  :hover {
    color: #bbb;
  }
  :active {
    background-color: #222;
  }
`;
const InputInfo = Styled.p`
  width: 100%;
  font-size: 12px;
  color: #aaa;
  line-height: 30px;
`;
const Todo = Styled.ul`
  width: 100%;
  height: calc(100% - 185px);
  margin-top: 30px;
  overflow-X: hidden;
  overflow-Y: auto;
`;
const OutLine = Styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto;
  position: relative;
  border-radius: 50%;
  background: conic-gradient(#282c34 0% 20%, #fff 10% 90%);
  animation: rotateAni infinite 1.5s ease;
`;
const InLine = Styled.div`
  width: 68px;
  height: 68px;
  position: absolute;
  top: calc(50% - 34px);
  left: calc(50% - 34px);
  border-radius: 50%;
  background: #282c34;
`;
const LoadingText = Styled.p`
  text-align: center;
  line-height: 50px;
  color: #fff;
  letter-spacing: 1px;
`;