import Dexie from 'dexie';
import styled, { css } from "styled-components";

const db = new Dexie('ReactDexie');

db.version(1).stores({
  comments: 'id,postId,name,email,body',
  photos: 'id,albumId,title,url,thumbnailUrl',
  todos: 'id,userId,title,completed',
  posts: 'id,userId,title,body',
});

export async function saveDataInIndexDB(data, key) {
  if (data) {
    if (db[key]) {
      await db[key].clear()
    }
    return db[key].bulkPut(data);
  }
}

export const LOADINGKEY = 'isLoading';

export const initialState = {
  'comments': {
    startTime: '',
    endTime: '',
    startSaveTime: '',
    startEndTime: '',
    [LOADINGKEY]: false,
  },
  'photos': {
    startTime: '',
    endTime: '',
    startSaveTime: '',
    startEndTime: '',
    [LOADINGKEY]: false,
  },
  'todos': {
    startTime: '',
    endTime: '',
    startSaveTime: '',
    startEndTime: '',
    [LOADINGKEY]: false,
  },
  'posts': {
    startTime: '',
    endTime: '',
    startSaveTime: '',
    startEndTime: '',
    [LOADINGKEY]: false,
  }
}

export const Div = styled.div`
  display: 'block';
  ${props => (props.flexRow || props.flexRow) && css`
    display: flex;
    flex-direction: ${props.flexRow ? 'row' : 'column'};
    flex-wrap: wrap;
  `}
`;

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  border: 1px solid black;
  margin: 2em;
`
export const ContainerItems = styled.div`
  width: 40%;
  flex-grow: 1;
  min-height: 50px;
  border: 1px solid black;
  justify-content: space-between;
  padding: 10px;
  ${props => props.width &&
    `width: ${props.width}`
  }
  ${props => props.textAlign && css`
    text-align: ${props.textAlign}
  `}
`
export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
`
export const CurrentTimestamp = styled.div`
  width: 100%,
  margin: 20px;
  padding: 20px;
  border: 1px solid black;
  text-align: center;
`