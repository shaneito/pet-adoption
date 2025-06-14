// refres to <template> tag with an id of pet-card-template
// create a document fragment, a dom outside the main dom that can be manipulated in memory beore being added to the main dom
const template = document.querySelector('#pet-card-template');

async function petsArea() {
  const wrapper = document.createDocumentFragment();
  const petsPromise = await fetch(
    'https://netlify-mypets.netlify.app/.netlify/functions/pets'
  );
  const petsData = await petsPromise.json();
  petsData.forEach(pet => {
    // returns copy of Node & text contents of content inside referenced template tag
    const clone = template.content.cloneNode(true);

    clone.querySelector('.pet-card').dataset.species = pet.species;

    clone.querySelector('h3').textContent = pet.name;
    clone.querySelector('.pet-description').textContent = pet.description;
    clone.querySelector('.pet-age').textContent = createAgeText(pet.birthYear);

    if (!pet.photo) pet.photo = 'images/fallback.jpg';

    clone.querySelector('.pet-card-photo img').src = pet.photo;
    clone.querySelector(
      '.pet-card-photo img'
    ).alt = `A ${pet.species} named ${pet.name}.`;

    wrapper.appendChild(clone);
  });
  console.table(wrapper.children);
  document.querySelector('.list-of-pets').appendChild(wrapper);
}

petsArea();

function createAgeText(birthYear) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  if (age == 1) return '1 year old';
  if (age == 0) return 'Less than a year old';

  return `${age} years old`;
}

// pet filter button code
const allButtons = document.querySelectorAll('.pet-filter button');

allButtons.forEach(el => {
  el.addEventListener('click', handleButtonClick);
});

function handleButtonClick(e) {
  // remove active class from any and all buttons
  allButtons.forEach(el => el.classList.remove('active'));

  // add active class to the specific button that just got clicked
  e.target.classList.add('active');

  // actually filter the pets down below
  const currentFilter = e.target.dataset.filter;
  document.querySelectorAll('.pet-card').forEach(el => {
    if (currentFilter == el.dataset.species || currentFilter == 'all') {
      el.style.display = 'grid';
    } else {
      el.style.display = 'none';
    }
  });
}
