const dog = 'Naayi';

document
  .querySelector('#myBtn')
  .addEventListener('click', function(event) {
    // testing out ES6 string interpolation
    console.log(`${dog} says: Button Clicked!`);
  });
