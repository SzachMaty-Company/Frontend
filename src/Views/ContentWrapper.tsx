import React, { ReactNode } from 'react';
import './ContentWrapper.css'

interface ContentWrapperProps {
  children: ReactNode;
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => <div className='content'>{children}</div>;

export default ContentWrapper;