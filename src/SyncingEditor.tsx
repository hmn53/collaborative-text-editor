import React, { useState, useRef, useEffect } from "react";
import { Editor } from "slate-react";
import { initialValue } from "./slateInitialValue";
import { Operation, Value, ValueJSON } from "slate";
import { css, cx } from "@emotion/css";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

interface Props {
  groupId: string;
}

const Wrapper = ({ className, ...props }) => (
  <div
    {...props}
    className={cx(
      className,
      css`
        max-width: 42em;
        margin: 20px auto;
        padding: 20px;
      `
    )}
  />
);

const ExampleContent = (props) => (
  <Wrapper
    {...props}
    className={css`
      background: #fff;
    `}
  />
);

export const SyncingEditor: React.FC<Props> = ({ groupId }) => {
  const [value, setValue] = useState(initialValue);
  const id = useRef(`${Date.now()}`);
  const editor = useRef<Editor | null>(null);
  const remote = useRef(false);

  useEffect(() => {
    fetch(`http://localhost:3001/groups/${groupId}`).then((x) =>
      x.json().then((data) => {
        console.log(data);
        setValue(Value.fromJSON(data));
      })
    );

    const eventName = `new-remote-operations-${groupId}`;
    socket.on(
      eventName,
      ({ editorId, ops }: { editorId: string; ops: Operation[] }) => {
        if (id.current !== editorId) {
          remote.current = true;
          ops.forEach((op: any) => editor.current!.applyOperation(op));
          remote.current = false;
        }
      }
    );

    return () => {
      socket.off(eventName);
    };
  }, []);

  return (
    <ExampleContent>
      <Editor
        ref={editor}
        style={{
          backgroundColor: "#fafafa",
          maxWidth: 800,
          minHeight: 150,
        }}
        value={value}
        onChange={(opts: any) => {
          setValue(opts.value);

          const ops = opts.operations
            .filter((o: any) => {
              if (o) {
                return (
                  o.type !== "set_selection" &&
                  o.type !== "set_value" &&
                  (!o.data || !o.data.has("source"))
                );
              }

              return false;
            })
            .toJS()
            .map((o: any) => ({ ...o, data: { source: "one" } }));

          if (ops.length && !remote.current) {
            socket.emit("new-operations", {
              editorId: id.current,
              ops,
              value: opts.value.toJSON(),
              groupId,
            });
          }
        }}
      />
    </ExampleContent>
  );
};
