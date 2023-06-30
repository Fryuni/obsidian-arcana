import { MarkdownView, Notice, TFile } from 'obsidian';
import MessageView from './MessageView';
import React from 'react';
import { useArcana } from 'src/hooks/hooks';
import { removeFrontMatter } from 'src/utilities/DocumentCleaner';

export function ConversationDialogue({
  current_file,
  systemMessage,
}: {
  current_file: TFile | null;
  systemMessage: string;
}) {
  //const arcana = useArcana();

  // TODO: Trigger when you addToMessage
  /*
    const dialogueRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    // Scroll to bottom
    if (dialogueRef.current) {
      dialogueRef.current.scrollTop = dialogueRef.current.scrollHeight;
    }
  }, [conversation]);
  */

  // Set timer for 2 seconds to wait for settings to load
  /*
  React.useEffect(() => {
    setConversationContext(systemMessage);
  }, [systemMessage]);

  const onSubmitMessage = React.useCallback(
    (e: any) => {
      if (e.key == 'Enter' && !isAIReplying) {
        const question = e.currentTarget.value;
        e.currentTarget.value = '';
        createUserMessage(question);
        askQuestion(question);
      }
    },
    [isAIReplying, askQuestion, createUserMessage]
  );

  const sendFileMessage = () => {
    if (!isAIReplying) {
      // Load the current_file
      if (!current_file) {
        new Notice('No current_file selected');
        return;
      }

      arcana.app.vault.read(current_file).then(fileContents => {
        const message = `Below is a document the user wants you to read. Once you have read, reply with "All read 👍." .\nTitle:${
          current_file.basename
        }\n${removeFrontMatter(fileContents)}`;
        createUserMessage("I'm sending you a document to read");
        askQuestion(message);
      });
    }
  };

  return (
    <div className="conversation">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <button className="beautiful-button" onClick={() => sendFileMessage()}>
          Send Note
        </button>
        <button
          className="beautiful-button"
          onClick={() => resetConversation()}
        >
          Reset
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div className="dialogue">
          {messages.map((message, i) => (
            <div key={i}>
              <MessageView
                message={message}
                onCancel={cancelAIMessage}
                onCopy={() => {
                  // Write the message to the current_file
                  // Get the editor for the active current_file
                  const mdView = arcana.app.workspace.getMostRecentLeaf()
                    ?.view as MarkdownView;
                  if (mdView) {
                    // Get current selection
                    const selection = mdView.editor.getSelection();
                    if (selection.length > 0)
                      mdView.editor.replaceSelection(
                        selection + ' ' + message.text
                      );
                    else mdView.editor.replaceSelection(message.text);
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ marginTop: '1em' }}>
          <input
            type="text"
            placeholder="Ask me something"
            onKeyUp={onSubmitMessage}
            className="beautiful-input"
          />
        </div>
      </div>
    </div>
  );
  */
  return <div></div>;
}
