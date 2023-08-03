import { Icon2fa, IconFileExport, IconSettings } from '@tabler/icons-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useContext, useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { SettingDialog } from '@/components/Settings/SettingDialog';

import { Import } from '../../Settings/Import';
import { SidebarButton } from '../../Sidebar/SidebarButton';
import ChatbarContext from '../Chatbar.context';
import { ClearConversations } from './ClearConversations';

import ChatContext from '@/app/chat/chat.context';

export const ChatbarSettings = () => {
  const { t } = useTranslation('sidebar');
  const [isSettingDialogOpen, setIsSettingDialog] = useState<boolean>(false);

  const {
    state: { conversations },
    dispatch: homeDispatch,
  } = useContext(ChatContext);

  const { data: session } = useSession()
  useEffect(() => {
    console.log('chatbar', {session});
  }, [session])
  // if (session) {
  //   return (
  //     <>
  //       Signed in as {session.user.email} <br />
  //       <button onClick={() => signOut()}>Sign out</button>
  //     </>
  //   )
  // }
  // return (
  //   <>
  //     Not signed in <br />
  //     <button onClick={() => signIn()}>Sign in</button>
  //   </>
  // )

  function login() {
    signIn();
  }

  const {
    handleClearConversations,
    handleImportConversations,
    handleExportData,
    handleApiKeyChange,
  } = useContext(ChatbarContext);
  

  return (
    <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">
      {/* TODO CLEAR CONVERSATIONS */}
      {/* {conversations.length > 0 ? (
        <ClearConversations onClearConversations={handleClearConversations} />
      ) : null} */}

      {/* TODO import and export */}
      {/* <Import onImport={handleImportConversations} />

      <SidebarButton
        text={t('Export data')}
        icon={<IconFileExport size={18} />}
        onClick={() => handleExportData()}
      /> */}

      <SidebarButton
        text={t('Settings')}
        icon={<IconSettings size={18} />}
        onClick={() => setIsSettingDialog(true)}
      />

        {session ? 
        <SidebarButton text={'Logout'} icon={<Icon2fa />} onClick={() => signOut()} /> : 
        <SidebarButton text={'Login'} icon={<Icon2fa />} onClick={() => signIn()} />
        }

      <SettingDialog
        open={isSettingDialogOpen}
        onClose={() => {
          setIsSettingDialog(false);
        }}
      />
    </div>
  );
};
