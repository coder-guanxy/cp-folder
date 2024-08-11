import { green, yellow, red, blue } from 'colorette';

export const getLogger = (name: string) => {
  const formatName = name ? `[${name}]: ` : '';

  return {
    info: (value: any) => {
      console.log(`${formatName}${blue(value)}`);
    },
    warn: (value: any) => {
      console.log(`${formatName}${yellow(value)}`);
    },
    error: (value: any) => {
      console.log(`${formatName}${red(value)}`);
    },
    success: (value: any) => {
      console.log(`${formatName}${green(value)}`);
    },
    log: (value: any) => {
      console.log(`${formatName}${value}`);
    },
  };
};
