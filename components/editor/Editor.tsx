'use client';

import Theme from './plugins/Theme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { HeadingNode } from '@lexical/rich-text';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import React from 'react';

import { FloatingComposer, FloatingThreads, liveblocksConfig, LiveblocksPlugin, useEditorStatus } from '@liveblocks/react-lexical'
import Loader from '../Loader';

import FloatingToolbarPlugin from './plugins/FloatingToolbarPlugin'
import { useThreads } from '@liveblocks/react/suspense';
import Comments from '../Comments';
import { DeleteModal } from '../DeleteModal';
import { cn } from '@/lib/utils';

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

export function Editor({ roomId, currentUser,currentUserType, creatorId }: { roomId: string, currentUser: string, currentUserType: UserType, creatorId: string }) {
  
  const status = useEditorStatus();
  const { threads } = useThreads();

  const initialConfig = liveblocksConfig({
    namespace: 'Editor',
    nodes: [HeadingNode],
    onError: (error: Error) => {
      console.error(error);
      throw error;
    },
    theme: Theme,
    editable: currentUserType === 'editor',
  });

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container size-full h-[100dvh]">
        <div className="toolbar-wrapper flex min-w-full justify-between h-1/12">
          <ToolbarPlugin />
          {currentUser === creatorId && <DeleteModal roomId={roomId} />}
        </div>

        <div className="h-10/12 lg:h-11/12 flex items-start max-lg:flex-col max-lg:items-center justify-start">
          {status === 'not-loaded' || status === 'loading' ? <Loader /> : (
            <div className='relative flex flex-1 h-2/3 w-full shadow-xl lg:h-full'>
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="editor-input !min-h-[300px] shadow-md w-full custom-scrollbar overflow-y-scroll" />
                }
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              {currentUserType === 'editor' && <FloatingToolbarPlugin />}
              <HistoryPlugin />
              <AutoFocusPlugin />
            </div>
          )}
          <div className={cn('max-lg:max-w-full max-lg:px-1 max-lg:pt-4 h-1/3 min-h-[100px] overflow-y-scroll custom-scrollbar lg:h-full', threads.length === 0 && "overflow-hidden")}>
              <LiveblocksPlugin>
                <FloatingComposer className="w-[350px]" />
                <FloatingThreads threads={threads} />
                <Comments />
              </LiveblocksPlugin>
          </div>
        </div>
      </div>
    </LexicalComposer>
  );
}