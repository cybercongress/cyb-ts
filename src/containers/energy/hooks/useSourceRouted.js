import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../context';

const initValue = {
  volt: 0,
  amper: 0,
};

const getCalculationBalance = (data) => {
  const balances = {};
  if (Object.keys(data).length > 0) {
    data.forEach((item) => {
      balances[item.denom] = parseFloat(item.amount);
    });
  }

  return balances;
};

function useGetSourceRoutes(addressActive, updateAddressFunc) {
  const { jsCyber } = useContext(AppContext);
  const [sourceRouted, setSourceRouted] = useState([]);
  const [destinationRoutes, setDestinationRoutes] = useState([]);
  const [sourceEnergy, setSourceEnergy] = useState(initValue);
  const [destinationEnergy, setDestinationEnergy] = useState(initValue);

  useEffect(() => {
    const sourceRoutedGet = async () => {
      setSourceRouted([]);

      if (jsCyber && jsCyber !== null && addressActive !== null) {
        try {
          const queryResultsourceRoutes = await jsCyber.sourceRoutes(
            addressActive
          );
          if (queryResultsourceRoutes.routes) {
            queryResultsourceRoutes.routes.forEach((item, index) => {
              queryResultsourceRoutes.routes[index].resource = {
                amper: 0,
                volt: 0,
              };
              const value = getCalculationBalance(item.value);
              queryResultsourceRoutes.routes[index].resource = {
                ...queryResultsourceRoutes.routes[index].resource,
                ...value,
              };
            });
            setSourceRouted(queryResultsourceRoutes.routes);
          }
        } catch (error) {
          console.log(error);
          setSourceRouted([]);
        }
      }
    };
    sourceRoutedGet();
  }, [jsCyber, addressActive, updateAddressFunc]);

  useEffect(() => {
    const sourceRoutedGet = async () => {
      setSourceEnergy(initValue);

      if (jsCyber && jsCyber !== null && addressActive !== null) {
        try {
          const queryResultsourceRoutedEnergy = await jsCyber.sourceRoutedEnergy(
            addressActive
          );
          if (queryResultsourceRoutedEnergy.value) {
            const { value } = queryResultsourceRoutedEnergy;
            const sourceRoutedEnergy = getCalculationBalance(value);
            if (sourceRoutedEnergy.amper) {
              setSourceEnergy((item) => ({
                ...item,
                amper: sourceRoutedEnergy.amper,
              }));
            }
            if (sourceRoutedEnergy.volt) {
              setSourceEnergy((item) => ({
                ...item,
                volt: sourceRoutedEnergy.volt,
              }));
            }
          }
        } catch (error) {
          console.log(error);
          setSourceEnergy(initValue);
        }
      }
    };
    sourceRoutedGet();
  }, [jsCyber, addressActive, updateAddressFunc]);

  useEffect(() => {
    setDestinationRoutes([]);
    const sourceRoutedGet = async () => {
      if (jsCyber && jsCyber !== null && addressActive !== null) {
        try {
          const queryResultdestinationRoutes = await jsCyber.destinationRoutes(
            addressActive
          );
          if (queryResultdestinationRoutes.routes) {
            queryResultdestinationRoutes.routes.forEach((item, index) => {
              queryResultdestinationRoutes.routes[index].resource = {
                amper: 0,
                volt: 0,
              };
              const value = getCalculationBalance(item.value);
              queryResultdestinationRoutes.routes[index].resource = {
                ...queryResultdestinationRoutes.routes[index].resource,
                ...value,
              };
            });
            setDestinationRoutes(queryResultdestinationRoutes.routes);
          }
        } catch (error) {
          console.log(error);
          setDestinationRoutes([]);
        }
      }
    };
    sourceRoutedGet();
  }, [jsCyber, addressActive, updateAddressFunc]);

  useEffect(() => {
    const sourceRoutedGet = async () => {
      setDestinationEnergy(initValue);
      if (jsCyber && jsCyber !== null && addressActive !== null) {
        try {
          const queryResultdestinationRoutedEnergy = await jsCyber.destinationRoutedEnergy(
            addressActive
          );
          if (queryResultdestinationRoutedEnergy.value) {
            const { value } = queryResultdestinationRoutedEnergy;
            const destinationRoutedEnergy = getCalculationBalance(value);
            if (destinationRoutedEnergy.amper) {
              setDestinationEnergy((item) => ({
                ...item,
                amper: destinationRoutedEnergy.amper,
              }));
            }
            if (destinationRoutedEnergy.volt) {
              setDestinationEnergy((item) => ({
                ...item,
                volt: destinationRoutedEnergy.volt,
              }));
            }
          }
        } catch (error) {
          console.log(error);
          setDestinationEnergy(initValue);
        }
      }
    };
    sourceRoutedGet();
  }, [jsCyber, addressActive, updateAddressFunc]);

  return { sourceRouted, sourceEnergy, destinationRoutes, destinationEnergy };
}

export default useGetSourceRoutes;
