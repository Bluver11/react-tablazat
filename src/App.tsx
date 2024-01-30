import { useEffect, useState } from 'react';
import './App.css';
import { Person } from './Person';
import { cloneDeep } from 'lodash';






function App() {

  console.log('App render')
  const [people,setPeople] = useState([] as Person[])
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [errorMessage, setErrorMessage] = useState('');

  //Use case 1: komponens beöltéskor fusson le
  useEffect(()=>{
   async function load(){
    try{
     const response = await fetch('http://localhost:3000/people');
     if(!response.ok){
        setErrorMessage('Hiba a letöltéskor')
        return;
     }
     const content = await response.json() as Person[];
     setPeople(content);
    }catch{
      setErrorMessage('Hiba a letöltéskor')
    }
   }
   load();
  },[])





  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (e) => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };


  const filteredPeople = people.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPeople = filteredPeople.sort((a, b) => {
    if (a.name < b.name) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (a.name > b.name) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });


  //USe case 2: változó megváltozásakor fusson le
  useEffect(()=>{
    document.title = `People (${sortedPeople.length}) `;

  },[sortedPeople.length])
  return (
    <div className="container">
      <h1>People</h1>
      <div className='alert danger-alert'>{errorMessage}</div>
      <label>
        Search by name:
        <br />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
        />
      </label>
      <table className='table table-striped table-hover'>
        <thead>
          <tr>
            <th onClick={handleSort} className='sortable'>Name
              {}</th >
            <th>Age</th>
            <th>City</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {sortedPeople.map((person,i) => (
            <tr key={person.id}>
              <td>{person.name}</td>
              <td>{person.age}</td>
              <td>{person.city}</td>
              <td>
                <button className='btn btn-danger'
                onClick={()=> {
                  //AZ elem indexe, mert a rendezett tömb != az eredeti tömbbel
                  const index = people.indexOf(person)
                  //Mássoljuk is
                  const newPeople = Array.from(people)
                  // TTöröljük az index-edik elemet
                  newPeople.splice(index,1)
                  //Tároljuk el
                  setPeople(newPeople)
                  //Új böngészőkben ez is mükődik, de VS code nem ad kiegészítést
                  //setPeople(people.toSplice(index,1))
                }}>
                  Remove
                  </button>
                  <button className='btn btn-primary'
                  onClick={()=>{
                    const index = people.indexOf(person)
                    const newPeople = cloneDeep(people)
                    newPeople[index].age++
                    setPeople(newPeople) 
                  
                /* const index = people.indexOf(person)
                 const newPeople = Array.from(people)
                 const newPerson = {
                  ...person,
                  age: person.age+1
                 };
                 newPeople[index] = newPerson;
                 setPeople(newPeople)*/
                  }}>
                    Age++ 🍰
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );



}

export default App
