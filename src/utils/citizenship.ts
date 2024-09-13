import { Citizenship, CitizenshipWithData } from 'src/types/citizenship';

export const parseToCitizenshipWithData = (
  passportData: Citizenship
): CitizenshipWithData => {
  const { extension, ...rest } = passportData;

  return {
    ...rest,
    extension: {
      ...extension,
      data: extension.data ? JSON.parse(extension.data) : null,
    },
  } as CitizenshipWithData;
};
