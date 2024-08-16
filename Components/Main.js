import React, { useState, useEffect } from "react";
import { FaCog, FaSignInAlt, FaBars, FaPlus, FaClock } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";

const Main = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("pomodoro");
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [initialMinutes, setInitialMinutes] = useState(25);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskHours, setTaskHours] = useState("");
  const [taskMinutes, setTaskMinutes] = useState("");
  const [taskSeconds, setTaskSeconds] = useState("");
  const [editTaskIndex, setEditTaskIndex] = useState(null);
  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    switch (mode) {
      case "pomodoro":
        setMinutes(pomodoroTime);
        setInitialMinutes(pomodoroTime);
        break;
      case "shortBreak":
        setMinutes(shortBreakTime);
        setInitialMinutes(shortBreakTime);
        break;
      case "longBreak":
        setMinutes(longBreakTime);
        setInitialMinutes(longBreakTime);
        break;
      default:
        break;
    }
    setSeconds(0);
  }, [mode, pomodoroTime, shortBreakTime, longBreakTime]);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    const sound = new Audio("bell.mp3");

    let countdown = null;

    if (isRunning) {
      countdown = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prevSeconds) => prevSeconds - 1);
        } else if (seconds === 0 && minutes > 0) {
          setMinutes((prevMinutes) => prevMinutes - 1);
          setSeconds(59);
        } else if (minutes === 0 && seconds === 0) {
          setIsRunning(false);
          setShowTimeUpModal(true);
          clearInterval(countdown);

          sound.play();
        }
      }, 1000);
    } else if (!isRunning && seconds !== 0) {
      clearInterval(countdown);
    }

    return () => {
      clearInterval(countdown);
    };
  }, [isRunning, minutes, seconds]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handlePomodoro = () => {
    setMode("pomodoro");
    setInitialMinutes(25);
    setMinutes(25);
    setSeconds(0);
    setIsRunning(false);
  };

  const handleShortBreak = () => {
    setMode("shortBreak");
    setInitialMinutes(5);
    setMinutes(5);
    setSeconds(0);
    setIsRunning(false);
  };

  const handleLongBreak = () => {
    setMode("longBreak");
    setInitialMinutes(15);
    setMinutes(15);
    setSeconds(0);
    setIsRunning(false);
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setMinutes(value);
    setSeconds(0);
    setIsRunning(false);
  };

  const handleCloseTimeUpModal = () => {
    setShowTimeUpModal(false);
  };

  const handleReset = () => {
    handleCloseTimeUpModal();
    if (mode === "pomodoro") {
      setMinutes(25);
      setInitialMinutes(25);
    } else if (mode === "shortBreak") {
      setMinutes(5);
      setInitialMinutes(5);
    } else if (mode === "longBreak") {
      setMinutes(15);
      setInitialMinutes(15);
    }
    setSeconds(0);
    setIsRunning(false);
  };

  const handleStop = () => {
    handleCloseTimeUpModal();
    setIsRunning(false);
  };

  const handleAddTask = () => {
    if (
      newTask.trim() !== "" &&
      taskHours.trim() !== "" &&
      taskMinutes.trim() !== "" &&
      taskSeconds.trim() !== ""
    ) {
      const totalSeconds =
        (parseInt(taskHours, 10) || 0) * 3600 +
        (parseInt(taskMinutes, 10) || 0) * 60 +
        (parseInt(taskSeconds, 10) || 0);
      const formattedTime = `${Math.floor(totalSeconds / 3600)}h ${Math.floor(
        (totalSeconds % 3600) / 60
      )}m ${totalSeconds % 60}s`;

      if (editTaskIndex !== null) {
        const updatedTasks = tasks.map((task, index) =>
          index === editTaskIndex
            ? { ...task, description: newTask, time: formattedTime }
            : task
        );
        setTasks(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        setEditTaskIndex(null);
      } else {
        const newTasks = [
          ...tasks,
          { description: newTask.trim(), time: formattedTime },
        ];
        setTasks(newTasks);
        localStorage.setItem("tasks", JSON.stringify(newTasks));
      }

      setNewTask("");
      setTaskHours("");
      setTaskMinutes("");
      setTaskSeconds("");
      setShowAddTaskModal(false);
    }
  };

  const handleDeleteAllTasks = () => {
    setTasks([]);
    localStorage.removeItem("tasks");
  };

  const handleCloseAddTaskModal = () => {
    setShowAddTaskModal(false);
    setNewTask("");
    setTaskHours("");
    setTaskMinutes("");
    setTaskSeconds("");
    setEditTaskIndex(null);
  };

  const handleSaveTask = () => {
    handleAddTask();
  };

  const handleSaveSettings = () => {
    setPomodoroTime(pomodoroTime);
    setShortBreakTime(shortBreakTime);
    setLongBreakTime(longBreakTime);
    setShowSettingsModal(false);
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(to right, #03001e, #7303c0, #ec38bc, #fdeff9)",
        minHeight: "110vh",
      }}
    >
      <header
        style={{
          color: "white",
          padding: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "640px",
          margin: "0 auto",
        }}
      >
        <button
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            borderRadius: "4px",
            padding: "4px 9px",
          }}
        >
          <FaBars style={{ fontSize: "20px" }} />
          <span style={{ marginLeft: "8px" }}>Menu</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <button
            onClick={() => setShowSettingsModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              borderRadius: "4px",
              padding: "4px 9px",
            }}
          >
            <FaCog style={{ fontSize: "20px" }} />
            <span style={{ marginLeft: "8px" }}>Setting</span>
          </button>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              borderRadius: "4px",
              padding: "4px 9px",
            }}
          >
            <FaSignInAlt style={{ fontSize: "20px" }} />
            <span style={{ marginLeft: "8px" }}>Sign In</span>
          </button>
        </div>
      </header>

      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          padding: "22px",
          maxWidth: "480px",
          margin: "40px auto",
          borderRadius: "8px",
          height: "350px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "16px", marginBottom: "5px" }}>
          <button
            style={{
              padding: "3px 5px",
              borderRadius: "8px",
              backgroundColor:
                mode === "pomodoro"
                  ? "rgba(75, 85, 99, 0.2)"
                  : "rgba(255, 255, 255, 0)",
              color: "white",
            }}
            onClick={handlePomodoro}
          >
            Pomodoro
          </button>
          <button
            style={{
              padding: "3px 5px",
              borderRadius: "8px",
              backgroundColor:
                mode === "shortBreak"
                  ? "rgba(75, 85, 99, 0.2)"
                  : "rgba(255, 255, 255, 0)",
              color: "white",
            }}
            onClick={handleShortBreak}
          >
            Short Break
          </button>
          <button
            style={{
              padding: "3px 5px",
              borderRadius: "8px",
              backgroundColor:
                mode === "longBreak"
                  ? "rgba(75, 85, 99, 0.2)"
                  : "rgba(255, 255, 255, 0)",
              color: "white",
            }}
            onClick={handleLongBreak}
          >
            Long Break
          </button>
        </div>

        <div style={{ color: "white", fontSize: "108px", fontWeight: "800" }}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>

        <input
          type="range"
          min="0"
          max="60"
          value={minutes}
          onChange={handleSliderChange}
          style={{
            width: "80%",
            marginTop: "10px",
            appearance: "none",
            background: "rgba(255, 255, 255, 0.5)",
            height: "8px",
            borderRadius: "4px",
            outline: "none",
            cursor: "pointer",
          }}
        />

        <button
          style={{
            marginTop: "40px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            color: "black",
            padding: "16px 32px",
            borderRadius: "8px",
            width: "160px",
            cursor: "pointer",
          }}
          onClick={handleStartPause}
        >
          {isRunning ? "PAUSE" : "START"}
        </button>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "0px",
          color: "white",
          fontSize: "24px",
        }}
      >
        {mode === "pomodoro" ? "Time to focus !" : "Time for a break !"}
      </div>

      <button
        onClick={() => setShowAddTaskModal(true)}
        style={{
          width: "480px",
          display: "flex",
          margin: "20px auto",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: "4px",
          padding: "15px 9px",
          border: "2px dashed white",
          color: "white",
          fontSize: "16px",
        }}
      >
        <FaPlus style={{ marginRight: "8px" }} />
        Add Task
      </button>

      <div style={{ maxWidth: "480px", margin: "0 auto" }}>
        <h2 style={{ color: "white" }}>Tasks</h2>
        <ul style={{ listStyleType: "none", padding: "0" }}>
          {tasks.map((task, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                borderRadius: "4px",
                marginBottom: "10px",
                color: "white",
              }}
            >
              <div>
                {task.description} - {task.time}
              </div>
              <div>
                <button
                  onClick={() => {
                    setEditTaskIndex(index);
                    setNewTask(task.description);
                    const [hours, minutes, seconds] = task.time.split(" ");
                    setTaskHours(hours.replace("h", ""));
                    setTaskMinutes(minutes.replace("m", ""));
                    setTaskSeconds(seconds.replace("s", ""));
                    setShowAddTaskModal(true);
                  }}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "white",
                  }}
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => {
                    const updatedTasks = tasks.filter(
                      (_, taskIndex) => taskIndex !== index
                    );
                    setTasks(updatedTasks);
                    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
                  }}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "white",
                  }}
                >
                  <RiDeleteBinLine />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <button
          onClick={handleDeleteAllTasks}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            border: "none",
            borderRadius: "4px",
            padding: "10px 20px",
            color: "black",
            fontSize: "18px",
            margin: "20px auto",
            cursor: "pointer",
          }}
        >
          Delete All Tasks
        </button>
      </div>

      {showTimeUpModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1000",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              width: "80%",
              maxWidth: "400px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FaClock style={{ fontSize: "48px", color: "gray" }} />
            <h2 style={{ margin: "10px 0" }}>Time&apos;s Up!</h2>
            <p style={{ margin: "10px 0" }}>
              The timer was set to{" "}
              {`${initialMinutes.toString().padStart(2, "0")}:${"00"}`}
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                style={{
                  margin: "10px",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  backgroundColor: "blue",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                style={{
                  margin: "10px",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  backgroundColor: "red",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={handleStop}
              >
                Stop
              </button>
            </div>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
            width: "500px",
            textAlign: "left",
          }}
        >
          <h2>Settings</h2>
          <hr style={{ margin: "10px 0" }} />
          <div style={{ marginBottom: "10px" }}>
            <h1 style={{ margin: "0", fontWeight: "bold" }}>Time</h1>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label>
                Pomodoro:
                <input
                  type="number"
                  value={pomodoroTime}
                  onChange={(e) =>
                    setPomodoroTime(parseInt(e.target.value, 10))
                  }
                  style={{
                    marginLeft: "8px",
                    width: "60px",
                    border: "2px solid #ccc",
                    borderRadius: "4px",
                    padding: "4px",
                  }}
                />
              </label>
            </div>
            <div>
              <label>
                Short Break:
                <input
                  type="number"
                  value={shortBreakTime}
                  onChange={(e) =>
                    setShortBreakTime(parseInt(e.target.value, 10))
                  }
                  style={{
                    marginLeft: "8px",
                    width: "60px",
                    border: "2px solid #ccc",
                    borderRadius: "4px",
                    padding: "4px",
                  }}
                />
              </label>
            </div>
            <div>
              <label>
                Long Break:
                <input
                  type="number"
                  value={longBreakTime}
                  onChange={(e) =>
                    setLongBreakTime(parseInt(e.target.value, 10))
                  }
                  style={{
                    marginLeft: "8px",
                    width: "60px",
                    border: "2px solid #ccc",
                    borderRadius: "4px",
                    padding: "4px",
                  }}
                />
              </label>
            </div>
          </div>
          <button
            onClick={handleSaveSettings}
            style={{
              margin: "10px",
              padding: "8px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Save
          </button>
          <button
            onClick={() => setShowSettingsModal(false)}
            style={{
              margin: "10px",
              padding: "8px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {showAddTaskModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1000",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              width: "80%",
              maxWidth: "400px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: "10px 0" }}>Add New Task</h2>
            <div
              style={{ width: "100%", marginBottom: "10px", textAlign: "left" }}
            >
              <label style={{ display: "block", marginBottom: "5px" }}>
                Task Title:
              </label>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter task title..."
                style={{
                  padding: "10px",
                  width: "100%",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <div style={{ width: "100%" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Hours:
                </label>
                <input
                  type="number"
                  value={taskHours}
                  onChange={(e) => setTaskHours(e.target.value)}
                  placeholder="Hours"
                  style={{
                    padding: "10px",
                    width: "100%",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>
              <div style={{ width: "100%" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Minutes:
                </label>
                <input
                  type="number"
                  value={taskMinutes}
                  onChange={(e) => setTaskMinutes(e.target.value)}
                  placeholder="Minutes"
                  style={{
                    padding: "10px",
                    width: "100%",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>
              <div style={{ width: "100%" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Seconds:
                </label>
                <input
                  type="number"
                  value={taskSeconds}
                  onChange={(e) => setTaskSeconds(e.target.value)}
                  placeholder="Seconds"
                  style={{
                    padding: "10px",
                    width: "100%",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                style={{
                  padding: "10px 20px",
                  borderRadius: "4px",
                  backgroundColor: "blue",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={handleAddTask}
              >
                Add
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  borderRadius: "4px",
                  backgroundColor: "red",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={handleCloseAddTaskModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
