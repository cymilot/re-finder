import React from "react";

export type DialogContentsProp = {
  dialogTitle: string;
  dialogContent?: React.JSX.Element;
  dialogAction?: React.JSX.Element[];
};

export type AppContextProp = {
  bgColor: string;
  setBgColor: (value: string) => void;
  dialogState: boolean;
  setDialogState: (value: boolean) => void;
  dialogContents: DialogContentsProp;
  setDialogContents: (value: DialogContentsProp) => void;
};

export const AppContext = React.createContext<AppContextProp>({
  bgColor: "",
  setBgColor: (_value: string) => {
    console.error("Function setBgColor is not definded.");
  },
  dialogState: false,
  setDialogState: (_value: boolean) => {
    console.error("Function setIsDialogOpen is not definded.");
  },
  dialogContents: {
    dialogTitle: "",
  },
  setDialogContents: (_value: DialogContentsProp) => {
    console.error("Function setDialogContents is not definded.");
  },
});

export const useAppContext = () => React.useContext(AppContext);

export const defaultBgColor = "#ffff00";
