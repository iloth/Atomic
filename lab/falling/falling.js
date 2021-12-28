const getNewAtom = () => {
  const electronNo = Math.floor(Math.random() * 4 + 1);
  const atom = document.createElement('div');
  atom.classList.add('atom', `atom--${electronNo}`, `free--${electronNo}`, 'new');
  const nucleus = document.createElement('div');
  nucleus.classList.add('nucleus');
  atom.appendChild(nucleus);
  const electrons = document.createElement('div');
  electrons.classList.add('electrons');
  const connections = document.createElement('div');
  connections.classList.add('connections');
  for (let i = 1; i <= 4; i++) {
    const electron = document.createElement('div');
    electron.classList.add('electron', `electron--${i}`);
    electrons.appendChild(electron);
    const connection = document.createElement('div');
    connection.classList.add('connection', `connection--${i}`);
    connections.appendChild(connection);
  }
  atom.appendChild(electrons);
  atom.appendChild(connections);

  return atom;

  // return `<div class="atom atom--${electrons} free--${electrons} new">
  //   <div class="nucleus"></div>
  //   <div class="electrons">
  //     <div class="electron electron--1"></div>
  //     <div class="electron electron--2"></div>
  //     <div class="electron electron--3"></div>
  //     <div class="electron electron--4"></div>
  //   </div>
  //   <div class="connections">
  //     <div class="connection connection--t"></div>
  //     <div class="connection connection--r"></div>
  //     <div class="connection connection--b"></div>
  //     <div class="connection connection--l"></div>
  //   </div>
  // </div>`;

};

const tube = document.querySelector('.tube');

for (let i = 1; i <= 5; i++) {
  setTimeout(() => {
    const newAtom = getNewAtom();
    tube.appendChild(newAtom);
    setTimeout(() => {
      newAtom.classList.remove('new');      
    }, 100);
  }, (i-1) * 2000);
}

// let atom = document.querySelector('.tube .atom.new');
// setTimeout(() => {
//   atom.classList.remove('new');
// }, 0);
