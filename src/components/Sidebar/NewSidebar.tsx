import { ReactNode } from 'react';

import {
  CloseSidebarButton,
  OpenSidebarButton,
} from './components/OpenCloseButton';

interface Props {
  isOpen: boolean;
  side: 'left' | 'right';
  toggleOpen: () => void;
  children: ReactNode | ReactNode[];
}

const Sidebar: React.FC<Props> = ({ isOpen, side, toggleOpen, children }) => {
  return isOpen ? (
    <div>
      <div
        className={`fixed top-0 ${side}-0 z-40 flex h-full w-[260px] flex-none flex-col space-y-2 bg-[#202123] p-2 text-[14px] transition-all sm:relative sm:top-0`}
      >
        {children}
      </div>

      <CloseSidebarButton onClick={toggleOpen} side={side} />
    </div>
  ) : (
    <OpenSidebarButton onClick={toggleOpen} side={side} />
  );
};

export default Sidebar;
