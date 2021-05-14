const dog = 'Naayi';

document
  .querySelector('#myBtn')
  .addEventListener(
    'click',
    // eslint-disable-next-line no-unused-vars
    (e) => {
      // eslint-disable-next-line no-console
      console.log(`${dog} says: Button Clicked!`);
    },
  );
