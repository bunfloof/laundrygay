'use client'

import React, { createContext, useState, useContext, useEffect } from 'react';

interface SettingsContextType {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
  defaultTab: string;
  setDefaultTab: (tab: string) => void;
  selectedAPI: string;
  setSelectedAPI: (api: string) => void;
  email: string;
  setEmail: (email: string) => void;
  offsetTime: string;
  setOffsetTime: (time: string) => void;
  backgroundUrl: string;
  setBackgroundUrl: (url: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState('laundrymachineselector');
  const [selectedAPI, setSelectedAPI] = useState('');
  const [email, setEmail] = useState('');
  const [offsetTime, setOffsetTime] = useState('1');
  const [backgroundUrl, setBackgroundUrl] = useState('');

  useEffect(() => {
    const storedDefaultTab = localStorage.getItem('defaultTab');
    const storedSelectedAPI = localStorage.getItem('selectedAPI');
    const storedEmail = localStorage.getItem('email');
    const storedOffsetTime = localStorage.getItem('offsetTime');
    const storedBackgroundUrl = localStorage.getItem('backgroundUrl');

    if (storedDefaultTab) setDefaultTab(storedDefaultTab);
    if (storedSelectedAPI) setSelectedAPI(storedSelectedAPI);
    if (storedEmail) setEmail(storedEmail);
    if (storedOffsetTime) setOffsetTime(storedOffsetTime);
    if (storedBackgroundUrl) setBackgroundUrl(storedBackgroundUrl);
  }, []);

  const handleSetDefaultTab = (tab: string) => {
    localStorage.setItem('defaultTab', tab);
    setDefaultTab(tab);
  };

  const handleSetSelectedAPI = (api: string) => {
    localStorage.setItem('selectedAPI', api);
    setSelectedAPI(api);
  };

  const handleSetEmail = (newEmail: string) => {
    localStorage.setItem('email', newEmail);
    setEmail(newEmail);
  };

  const handleSetOffsetTime = (time: string) => {
    localStorage.setItem('offsetTime', time);
    setOffsetTime(time);
  };

  const handleSetBackgroundUrl = (url: string) => {
    localStorage.setItem('backgroundUrl', url);
    setBackgroundUrl(url);
  };

  return (
    <SettingsContext.Provider
      value={{
        isSettingsOpen,
        setIsSettingsOpen,
        defaultTab,
        setDefaultTab: handleSetDefaultTab,
        selectedAPI,
        setSelectedAPI: handleSetSelectedAPI,
        email,
        setEmail: handleSetEmail,
        offsetTime,
        setOffsetTime: handleSetOffsetTime,
        backgroundUrl,
        setBackgroundUrl: handleSetBackgroundUrl,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};