export const filters = {
  ALL: 'all',
  CURRENT: 'current',
  DONE: 'done'
};

export const focusLevels = {
  NONE: 0,
  LOW: 1,
  MID: 2,
  HIGH: 3,

  bubbleDown(level) {
    return level === 0
      ? level
      : (level + 4 - 1) % 4;
  },

  bubbleUp(level, until) {
    return (level === 0 || level >= until)
      ? level
      : (level + 1) % 4;
  }
};

export function pad(num, size, lead = '0') {
  let str = num.toString();

  while(str.length < size) {
    str = lead.toString() + str;
  }

  return str;
}

export function formatDateString(year, month, date) {
  return `${pad(year, 4)}-${pad(month, 2)}-${pad(date, 2)}`;
}

export function formatTimeString(hour, minute) {
  return `${pad(hour, 2)}:${pad(minute, 2)}`;
}

export function msToHumanString(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  const hours = Math.floor((ms / 1000 / 60 / 60) % 24);
  const days = Math.floor(ms / 1000 / 60 / 60 / 24);

  if(days > 0) {
    const preciseDays = (ms / 1000 / 60 / 60 / 24).toFixed(2);

    return `${preciseDays} days`;
  } else if(hours > 0) {
    return `${hours}:${pad(minutes, 2)}:${pad(seconds, 2)}`;
  } else if(minutes > 0 || seconds > 0) {
    return `${minutes}:${pad(seconds, 2)}`;
  } else {
    return '0:00';
  }
}

export function checkForChrome() {
  return new Promise(function(resolve, reject) {
    if(!window.chrome || !window.chrome.storage) {
      reject(new Error('Cannot access Chrome Storage API'));
      return;
    }

    resolve();
  });
}

let saveTimer;
const saveDelay = 1000;
export function saveTodo(todoList) {
  return checkForChrome().then(function() {
    return new Promise(function(resolve, reject) {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function() {
        window.chrome.storage.sync.set({ todo: todoList }, function() {
          if(window.chrome.runtime.lastError) {
            reject(new Error(window.chrome.runtime.lastError.message));
          }
          resolve(todoList);
        });
      }, saveDelay);
      setTimeout(resolve, saveDelay + 5000);
    });
  }, function(e) {
    throw e;
  });
}

export function loadTodo() {
  return checkForChrome().then(function() {
    return new Promise(function(resolve, reject) {
      window.chrome.storage.sync.get('todo', function(result) {
        if(window.chrome.runtime.lastError) {
          reject(new Error(window.chrome.runtime.lastError.message));
        }

        resolve(result.todo);
      });
    });
  }, function(e) {
    throw e;
  });
}
