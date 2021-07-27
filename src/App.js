import { useEffect, useState } from 'react';
import { DisplayTimes } from './components/DisplayTime';
import { FetchButton } from './components/FetchButton';
import axios from 'axios';
import { Container, ContainerItems, Div, Grid, initialState, saveDataInIndexDB } from './util';


function App() {

  const [appState, setAppState] = useState(initialState);
  const [error, SetError] = useState(null);
  const [isAppLoading, setIsAppLoading] = useState(true);


  const updateTimeInSpecificState = (stateOfApp, timeKey, key, time) => {
    const keyState = Object.assign({}, stateOfApp[key]);
    const updatedKeyState = Object.assign({}, keyState, { [timeKey]: Date.now() });
    return Object.assign({}, stateOfApp, {
      [key]: updatedKeyState,
    })
  };

  // updating state on same function multiple time making react to make a batch update of state
  const setWebAppState = (timeKey, key, time) => {
    setAppState((appState) => {
      const stateWithEndTime =
        updateTimeInSpecificState(appState, timeKey, key, time);
      return stateWithEndTime
    });
  }

  const onButtonClick = async (key) => {
    setWebAppState('startTime', key, Date.now());
    try {
      const data = await axios.get(`/${key}`);
      setWebAppState('endTime', key, Date.now());
      setWebAppState('startSaveTime', key, Date.now());
      await saveDataInIndexDB(data.data, key)
      setWebAppState('startEndTime', key, Date.now());
      return Promise.resolve(true)
    } catch (e) {
      console.log(error);
      SetError(e.name);
      return Promise.resolve(false);
    }
  };

  const fetchAll = () => {
    const keys = Object.keys(initialState);
    return Promise.all(keys.map((i) => onButtonClick(i)))
  }

  useEffect(() => {
    fetchAll();
    const id = setTimeout(
      () => setIsAppLoading(false),
      5000
    );
    return () => {
      clearTimeout(id);
    };
  }, []);


  if (isAppLoading) {
    return (
      <Div style={{ width: '100%', height: '100%', textAlign: 'center' }}>
        loading
      </Div>
    )
  }

  if (error) {
    return (
      <div>
        Something went wrong, please check console log
      </div>
    )
  }


  return (
    <Div flexColumn>
      <Container>
        <ContainerItems style={{ width: '100%', textAlign: 'center' }}>
          Test App
        </ContainerItems>
        {Object.keys(appState).map(key =>
          <DisplayTimes
            key={key}
            {...appState[key]}
          />
        )}
        <ContainerItems style={{ width: '100%' }}>
          <Grid>
            {Object.keys(appState).map((key, index) =>
              <FetchButton
                key={key}
                name={`Fetch: ${key}`}
                onClick={() => onButtonClick(key)}
              />
            )}
          </Grid>
          <br />
          <FetchButton name="Fetch All Data" style={{ width: '100%' }} onClick={fetchAll} />
        </ContainerItems>
      </Container>
    </Div>
  );
}

export default App;
