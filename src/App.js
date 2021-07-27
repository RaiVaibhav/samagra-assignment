import { useEffect, useState } from 'react';
import { DisplayTimes } from './components/DisplayTime';
import { FetchButton } from './components/FetchButton';
import axios from 'axios';
import { Container, ContainerItems, Div, Grid, initialState, LOADINGKEY, saveDataInIndexDB } from './util';


function App() {

  const [appState, setAppState] = useState(initialState);
  const [error, SetError] = useState(null);
  const [isAppLoading, setIsAppLoading] = useState(true);


  const updateTimeInSpecificState = (stateOfApp, timeKey, key, time, isLoading) => {
    const keyState = Object.assign({}, stateOfApp[key]);
    if (timeKey === LOADINGKEY) {
      const updatedKeyState = Object.assign({}, keyState, { [timeKey]: isLoading });
      return Object.assign({}, stateOfApp, {
        [key]: updatedKeyState,
      });
    }

    const updatedKeyState = Object.assign({}, keyState, { [timeKey]: time });
    return Object.assign({}, stateOfApp, {
      [key]: updatedKeyState,
    });
  };

  // updating state on same function multiple time making react to make a batch update of state
  const setWebAppState = (timeKey, key, time, isLoading) => {
    setAppState((appState) => {
      const stateWithEndTime =
        updateTimeInSpecificState(appState, timeKey, key, time, isLoading);
      return stateWithEndTime
    });
  }

  const setLoadingOfSpecificState = (key) => {
    setWebAppState(LOADINGKEY, key, undefined, true);
    setTimeout(() => setWebAppState(LOADINGKEY, key, undefined, false), 5000);
  }

  const fetchDataAndSetTimestamps = async (key) => {
    setLoadingOfSpecificState(key);
    setWebAppState('startTime', key, Date.now(), undefined);
    try {
      const data = await axios.get(`https://jsonplaceholder.typicode.com/${key}/`);
      setWebAppState('endTime', key, Date.now());
      setWebAppState('startSaveTime', key, Date.now());
      await saveDataInIndexDB(data.data, key)

      // Todo: using of dexie have one disadvantage where we can't
      //get the date from the response hearder just like axios
      setWebAppState('startEndTime', key, Date.now());
      return Promise.resolve(true)
    } catch (e) {
      console.log(error);
      SetError(e.name);
      return Promise.resolve(false);
    }
  }

  const onButtonClick = (key) => {
    fetchDataAndSetTimestamps(key);
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
  
    // It needed, else will have to useCallback and which again need some memoize array dependency
    // just like and same error will be shown by the es-lint
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
