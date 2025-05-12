import {
  animate,
  AnimatePresence,
  motion,
  useIsPresent,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * For the overlay circles, this example uses elements with
 * a high blur radius. A more performant approach could be to
 * bake these circles into background-images as pre-blurred pngs.
 */

export default function WarpOverlay({ intensity = 0.1 }) {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    setSize({
      width: ref.current?.clientWidth || 0,
      height: ref.current?.clientHeight || 0,
    });
  }, [ref]);

  const [selectedEmails, setSelectedEmails] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deform = useMotionValue(0);
  const rotateX = useTransform(() => deform.get() * -5);
  const skewY = useTransform(() => deform.get() * -1.5);
  const scaleY = useTransform(() => 1 + deform.get() * intensity);
  const scaleX = useTransform(() => 1 - deform.get() * intensity * 0.6);

  // Open delete modal and trigger deformation animation
  const handleDeleteClick = () => {
    if (selectedEmails.length === 0) return;

    setIsDeleteModalOpen(true);

    animate([
      [deform, 1, { duration: 0.3, ease: [0.65, 0, 0.35, 1] }],
      [deform, 0, { duration: 1.5, ease: [0.22, 1, 0.36, 1] }],
    ]);
  };

  const handleCheckboxChange = (index) => {
    setSelectedEmails((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const closeModal = () => setIsDeleteModalOpen(false);

  const [isOn, setIsOn] = useState(true);
  const [formData, setFormData] = useState({
    title: "sdfff",
    button: "df",
    postback: "sdfa",
  });

  const spring = {
    type: "spring",
    visualDuration: 0.2,
    bounce: 0.2,
  };

  return (
    <div className="iphone-wrapper body">
      <div>
        <form action="">
          <input
            className="form-control"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                ["title"]: e.target.value,
              }))
            }
          />
          <div className="button-available">
            <div className="switch-wrap">
              <div
                className="switch"
                data-is-on={isOn}
                onClick={() => setIsOn(!isOn)}
              >
                <motion.span
                  className="ball"
                  layout
                  transition={spring}
                ></motion.span>
              </div>
              Button Type
            </div>
            <AnimatePresence initial={false}>
              {isOn ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  key="input-box"
                >
                  <input
                    className="form-control"
                    placeholder="Button"
                    value={formData.button}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ["button"]: e.target.value,
                      }))
                    }
                  />
                  <input
                    className="form-control"
                    placeholder="Postback Message"
                    value={formData.postback}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ["postback"]: e.target.value,
                      }))
                    }
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </form>
      </div>
      <div className="iphone-mock">
        <div className="iphone-screen">
          <div className="dynamic-island"></div>
          <div className="iphone-status-bar">
            <div className="status-time">9:41</div>
          </div>

          <div className="app-content" ref={ref}>
            <motion.div
              className="email-app-container"
              style={{
                rotateX,
                skewY,
                scaleY,
                scaleX,
                originX: 0.5,
                originY: 0,
                transformPerspective: 500,
                willChange: "transform",
              }}
            >
              <header className="header">
                <h1 className="h2">Message</h1>
              </header>

              <div className="message-content">
                <div className="message-list">
                  <motion.div className="user-message">
                    {formData.title && <p>{formData.title}</p>}
                    <AnimatePresence initial={false}>
                      {isOn && formData.button ? (
                        <motion.button
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          key="ui-btn-box"
                          className="user-msg-button"
                        >
                          {formData.button}
                        </motion.button>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>
                  {formData.button && (
                    <div className="my-message">
                      <p>{formData.button}</p>
                    </div>
                  )}
                  {formData.postback && (
                    <div className="user-message">
                      <p>{formData.postback}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {isDeleteModalOpen ? (
              <ImmersiveOverlay
                close={closeModal}
                itemCount={selectedEmails.length}
                size={size}
              />
            ) : null}
          </AnimatePresence>

          <div className="iphone-home-indicator"></div>
        </div>
      </div>
      <StyleSheet />
    </div>
  );
}

/**
 * ==============   Styles   ================
 */
function StyleSheet() {
  return (
    <style>{`
        body {
            overflow: hidden;
            margin: 50;
            padding: 50;
            background-color: #f0f0f0;
        }

        .iphone-wrapper {
            display: flex;
            justify-content: space-between;
            
            width: 100%;
            height: 100%;
            box-sizing: border-box;
        }

        .iphone-mock {
            position: relative;
            width: 375px;
            height: 812px;
            background-color: #1a1a1a;
            border-radius: 50px;
            box-shadow: 0 0 0 14px #121212, 0 0 0 17px #232323, 0 20px 40px rgba(0, 0, 0, 0.8);
            padding: 0;
            box-sizing: border-box;
            overflow: hidden;
        }

        @media (max-height: 900px) {
            .iphone-mock {
                width: 300px;
                height: 600px;
            }
        }

        @media (max-height: 600px) {
            .iphone-wrapper {
               padding: 0;
             }

            .iphone-mock {
                width: 100%;
                height: 100%;
                background-color: transparent;
                border-radius: 0;
                padding-top: 50px;
                box-shadow: none;
            }

            .dynamic-island {
                display: none;
            }

            .iphone-status-bar {
                display: none !important;
            }

            .iphone-home-indicator {
                display: none;
            }

            .iphone-screen {
                border-radius: 0;
            }
        }

        .iphone-screen {
            position: relative;
            width: 100%;
            height: 100%;
            background-color: #0b1011;
            border-radius: 38px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .dynamic-island {
            position: absolute;
            top: 12px;
            left: 50%;
            transform: translateX(-50%);
            width: 120px;
            height: 34px;
            background-color: #000;
            border-radius: 20px;
            z-index: 2000;
        }

        .iphone-status-bar {
            height: 60px;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            color: white;
            font-weight: 600;
            font-size: 14px;
            padding-top: 15px;
        }

        .iphone-home-indicator {
            position: absolute;
            bottom: 8px;
            left: 50%;
            transform: translateX(-50%);
            width: 134px;
            height: 5px;
            background-color: white;
            opacity: 0.2;
            border-radius: 3px;
            z-index: 2000;
        }

        .app-content {
            flex: 1;
            padding: 0;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            margin-top: 10px;
        }

        .email-app-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            background-color: #0b1011;
            color: #f5f5f5;
            border: none;
            border-radius: 0;
            overflow: hidden;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 26px 20px 16px;
            border-bottom: 1px solid #1d2628;
        }

        .header h1 {
            font-size: 24px;
            margin: 0;
        }

        .delete-button {
            background-color: #fff4;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }

        .delete-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background-color: #fff0;
        }

        .email-list {
            flex: 1;
            overflow-y: auto;
            padding: 0;
        }

        .email-item {
            display: flex;
            padding: 16px 20px;
            border-bottom: 1px solid #1d2628;
            align-items: center;
            display: flex;
            gap: 16px;
        }

        .checkbox {
            width: 20px;
            height: 20px;
        }

        .email-content {
            flex: 1;
        }

        .email-content h3 {
            margin: 0 0 8px 0;
            font-size: 16px;
        }

        .email-content p {
            margin: 0;
            font-size: 14px;
            opacity: 0.7;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .overlay-root {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
        }

        .overlay-content {
            background: rgb(246, 63, 42, 0.2);
            backdrop-filter: blur(3px);
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1001;
            will-change: opacity;
        }

        .modal-content {
            width: 75%;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 30px;
            will-change: transform;
        }

        .modal-content p {
            color: #f5f5f5;
        }

        .modal-content header {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 5px;
        }

        .controls {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 10px;
        }

        button.delete {
            background-color: #f5f5f5;
            color: #0f1115;
            border-radius: 20px;
            padding: 10px 20px;
        }

        .gradient-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1001;
        }

        .expanding-circle {
            position: absolute;
            border-radius: 50%;
            background:  rgb(251, 148, 137,0.8);
            filter: blur(15px);
            transform-origin: center;
            will-change: transform;
        }

        .gradient-circle {
            position: absolute;
            border-radius: 50%;
            filter: blur(100px);
            width: 200%;
            aspect-ratio: 1;
            will-change: transform;
        }

        .top-left {
            background: rgb(246, 63, 42, 0.9);
        }

        .bottom-right {
            background: rgb(243, 92, 76, 0.9);
        }
        .message-content{
            flex: 1;
            align-items: flex-end;
            display: flex;
            width: 100%;
        }
        .message-list {
            width: 100%;
            display: flex;
            flex-direction: column-reverse; 
            padding: 10px;
            gap: 10px;
        }
        
        .user-message {
            display: flex;
            justify-content: flex-start; 
            background-color: #d5d1d1;
            color: black;
            border-radius: 10px;
            padding: 6px;
            max-width: 80%; 
        }
        
        .my-message {
            display: flex;
            justify-content: flex-end; 
            background-color: #881b88;
            color: white;
            border-radius: 10px;
            padding: 6px;
            max-width: 80%; 
            align-self: flex-end;
        }
        .user-message p, .my-message p {
            margin-bottom:0px;
            font-size:17px;
            font-weight:500;
        }
        .user-message{
            background-color:#d5d1d1;
            color:black;
            border-top-left-radius:0px;
            margin-left:10px;
            margin-right:5px;
            flex-direction:column;
        }
        .my-message{
            background-color:#881b88;
            border-bottom-right-radius:0px;
            margin-left:10px;
            margin-right:5px;
            float:right;
        }
        .user-msg-button{
            width:100%;
            height:100%;
            text-align:'center';
            font-size:18px;
            font-weight:800;
            border: 1px solid #d0cece;
            border-radius: 25px;
            margin-top:8px;
        }
        .form-control{
            border-radius:10px;
            background:white;
            color:black;
            border:1px solid #d0cece;
            margin-bottom:5px;
        }
        
        .switch-wrap{
            display:flex;
            gap:10px;
            color:black;
            font-weight:700;
        }

        .switch {
            width: 50px;
            height: 23px;
            background-color: #6aaa6a;
            display: flex;
            align-items: center;
            border-radius: 50px;
            padding: 4px;
            cursor: pointer;
            justify-content:flex-start;
            margin-bottom:5px;
        }

        .switch[data-is-on='true']{
            justify-content:flex-end;
            background-color:#2a7b1f;
        }

        .ball {
            width: 15px;
            height: 15px;
            background-color: #f5f5f5;
            border-radius: 30px;
            will-change: transform;
            
            
        }
        .button-available{
            
        }

        
    `}</style>
  );
}
