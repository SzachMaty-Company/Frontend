import React, { ReactNode } from 'react';
import './ContentWrapper.css'

interface ContentWrapperProps {
  children: ReactNode;
  isCentered: boolean;
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children, isCentered }) => <div className={`${isCentered ? 'centeredContent' : 'leftAllignedContent'}`}>{children}</div>;

export default ContentWrapper;