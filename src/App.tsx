import { useEffect, useState } from 'react';
import './App.css';






function App() {

  console.log('App render')
  const [people,setPeople] = useState([])
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [errorMessage, setErrorMessage] = useState('');

  //Use case 1: komponens beöltéskor fusson le
  useEffect(()=>{
   async function load(){
    try{
     const response = await fetch('/people.json');
     if(!response.ok){
        setErrorMessage('Hiba a letöltéskor')
        return;
     }
     const content = await response.json();
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

  useEffect(()=>{
    document.title = `People (${sortedPeople.length}) `;

  },[sortedPeople.length])
  return (
    <div className="container">
      <h1>People</h1>
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
          </tr>
        </thead>
        <tbody>
          {sortedPeople.map((person) => (
            <tr key={person.id}>
              <td>{person.name}</td>
              <td>{person.age}</td>
              <td>{person.city}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );



}

export default App
