import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  createMessageAction,
  clearMessages,
  wsConnect,
  wsDisconnect
} from "actions";
import { useSelector, useDispatch } from "react-redux";
import { Message } from "components/Message";
import classNames from "classnames";
import "./ChatPage.scss";

const ChatPage = () => {
  const params = useParams();
  const location = useLocation();
  const [value, setValue] = useState("");
  const messages = useSelector(state => state.messagesReducer);
  const dispatch = useDispatch();

  const handleSubmit = e => {
    e.preventDefault();
    if (location.pathname.includes("monitor"))
      dispatch(createMessageAction(value, `${params.subject}.answer`));
    else dispatch(createMessageAction(value, `${params.subject}.question`));
  };

  useEffect(() => {
    if (location.pathname.includes("monitor"))
      dispatch(
        wsConnect(
          process.env.REACT_APP_SOCKET_URL,
          `${params.subject}.question`
        )
      );
    else
      dispatch(
        wsConnect(process.env.REACT_APP_SOCKET_URL, `${params.subject}.answer`)
      );
    return () => {
      dispatch(wsDisconnect());
      dispatch(clearMessages());
    };
  }, [dispatch, location, params]);

  return (
    <div className="chat-page container">
      <div className="jumbotron bg-white">
        <div className="row">
          <div className="col">
            <div className="messages mb-3 d-flex flex-column">
              {Object.entries(messages).map(([key, message]) => (
                <Message
                  message={message}
                  key={key}
                  classList={classNames({
                    "question bg-dark": message.type.includes("question"),
                    "answer bg-primary": message.type.includes("answer")
                  })}
                />
              ))}
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <textarea
                  type="text"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  className="form-control"
                  placeholder="Escreva sua dúvida"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <input
                className="btn btn-primary px-5 float-right"
                value="Enviar"
                type="submit"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
