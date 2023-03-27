import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../context';

const initValue = {
  millivolt: 0,
  milliampere: 0,
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
                milliampere: 0,
                millivolt: 0,
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
          const queryResultsourceRoutedEnergy =
            await jsCyber.sourceRoutedEnergy(addressActive);
          if (queryResultsourceRoutedEnergy.value) {
            const { value } = queryResultsourceRoutedEnergy;
            const sourceRoutedEnergy = getCalculationBalance(value);
            if (sourceRoutedEnergy.milliampere) {
              setSourceEnergy((item) => ({
                ...item,
                milliampere: sourceRoutedEnergy.milliampere,
              }));
            }
            if (sourceRoutedEnergy.millivolt) {
              setSourceEnergy((item) => ({
                ...item,
                millivolt: sourceRoutedEnergy.millivolt,
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
                milliampere: 0,
                millivolt: 0,
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
          const queryResultdestinationRoutedEnergy =
            await jsCyber.destinationRoutedEnergy(addressActive);
          if (queryResultdestinationRoutedEnergy.value) {
            const { value } = queryResultdestinationRoutedEnergy;
            const destinationRoutedEnergy = getCalculationBalance(value);
            if (destinationRoutedEnergy.milliampere) {
              setDestinationEnergy((item) => ({
                ...item,
                milliampere: destinationRoutedEnergy.milliampere,
              }));
            }
            if (destinationRoutedEnergy.millivolt) {
              setDestinationEnergy((item) => ({
                ...item,
                millivolt: destinationRoutedEnergy.millivolt,
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
