import React, { useRef, useState, useContext } from 'react';
import Styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { funcContext } from './../App';

const List = ({ keyName, value }) => {
  const chkBox = useRef();
  const textValue = useRef();
  const textInput = useRef();
  const editBtn = useRef();
  const [editMode, setEditMode] = useState(false);
  const fetchFn = useContext(funcContext);
  
  const chkChange = (e) => {
    let target = chkBox.current;
    fetchFn._putTodoList(
      target.id, 
      { text: target.nextSibling.nextSibling.textContent, complete: target.checked }
    );
  }
  const editClick = (e) => {
    let id = textInput.current.id;
    let val = textInput.current.value;
    
    if (editMode) {
      if (val === '') {
        textInput.current.focus();
        return;
      }
      fetchFn._putTodoList(id, { text: val, complete: false });
    } else {
      setTimeout(() => textInput.current.focus(), 50);
    }
    setEditMode(!editMode);
  }
  const delClick = (e) => {
    let ask = window.confirm('해당 리스트를 삭제하시겠습니까?');
    if (!ask) return;
    let id = textInput.current.id;
    fetchFn._deleteTodoList(id);
  }

  return (
    <Li>
      <Left>
        <ChkBox 
          type="checkbox" 
          id={keyName} 
          ref={chkBox}
          defaultChecked={value.complete} 
          onChange={chkChange} 
          hidden 
        />
        <ChkLabel htmlFor={keyName}>
          <FontAwesomeIcon icon={faCheck} />
        </ChkLabel>
        <Text ref={textValue}>
          {editMode || value.text}
          <input ref={textInput}
            id={keyName}
            style={{
              width: '166px', height: '22px',
              fontSize: '12px', padding: '0 4px',
              border: '1px solid #aaa',
              display: editMode ? 'inline-block' : 'none'
            }}
            defaultValue={value.text}
          />
        </Text>
      </Left>
      <Right>
        <EditBtn ref={editBtn} onClick={editClick}>
          <FontAwesomeIcon icon={editMode ? faCheck : faEdit} />
        </EditBtn>
        <DelBtn onClick={delClick}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </DelBtn>
      </Right>
    </Li>
  )
}

export default List;

const Li = Styled.li`
  background-color: #ccc;
  margin-bottom: 10px;
  padding: 16px 10px;
  border: none;
  border-radius: 8px;
  box-shadow: 2px 2px 5px #ffffff50;
  overflow: auto;
`;
const Left = Styled.div`
  width: calc(100% - 100px);
  height: 100%;
  font-size: 13px;
  display: flex;
  align-items: center;
  float: left;
`;
const Right = Styled.div`
  width: 100px;
  height: 100%;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  float: right;
`;
const ChkBox = Styled.input`
  :checked + label {
    background-color: #aaa;
    svg {
      display: block;
    }
    & + p {
      text-decoration: line-through;
      color: #777;
    }
  }
`;
const ChkLabel = Styled.label`
  width: 20px;
  height: 20px;
  margin-right: 8px;
  background-color: #fff;
  border-radius: 50%;
  transition: .3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;
const Text = Styled.p`
  user-select: none;
  width: calc(100% - 28px);
  height: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const EditBtn = Styled.button`
  padding: 2px 4px;
  font-size: 16px;
  color: #464ff4;
  cursor: pointer;
  border: none;
  background-color: transparent;
`;
const DelBtn = Styled.button`
  padding: 2px 4px;
  font-size: 16px;
  color: #fc0c12;
  margin-left: 4px;
  cursor: pointer;
  border: none;
  background-color: transparent;
`;