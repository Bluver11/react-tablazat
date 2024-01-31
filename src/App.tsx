import { FormEvent, useEffect, useState } from 'react';
import './App.css';
import { Person } from './Person';
import { cloneDeep } from 'lodash';
import { NestjsError } from './NestjsError';






function App() {

  console.log('App render')
  const [people,setPeople] = useState([] as Person[])
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [errorMessage, setErrorMessage] = useState('');

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
  //Use case 1: komponens beöltéskor fusson le
  useEffect(()=>{
   
   load();
  },[])





  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (e) => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };


  const filteredPeople = people.filter((person) => person.id === parseInt(searchTerm)||
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

  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [city,setCity] = useState('');

  async function newPerson(e:FormEvent){
    e.preventDefault();

      //Itt lehet validálni
    const newPersonToSend ={
      name, age, city
    }


   const response = await fetch('http://localhost:3000/people',{
      method: 'POST',
      body: JSON.stringify(newPersonToSend),
      headers: {
        "Content-type": "application/json",
        "Accept":"application/json",
      }

    });

    if(response.status ==400){
      const errorBody = await response.json() as NestjsError;
      setErrorMessage(errorBody.message.join(', '))
    }else if(!response.ok){
      setErrorMessage('Hiba a küldéskor')
    }else{
      // 1. lehetőség:
      //Hozzáfűzzük az új adatot a létezőhöz
    //   const personWithId=await response.json() as Person;
    // setPeople([
    //   ...people,
    //   personWithId])
    // 
    //2. töltsünk újra mindent
    await load();
  }

  }

  async function deletePeron(p: Person) {

       const response = await fetch(`http://localhost:3000/people/${p.id}`,{
      method: 'DELETE'
      });
      if(!response.ok){
        setErrorMessage('Hiba a küldésekor')

      }else{
        await load();
      }
  }

  async function addOneYear(p:Person) {

    const newPersonToSend ={
       age: p.age+1
    }


   const response = await fetch(`http://localhost:3000/people/${p.id}`,{
      method: 'PATCH',
      body: JSON.stringify(newPersonToSend),
      headers: {
        "Content-type": "application/json",
        "Accept":"application/json",
      }

    });
    if(!response.ok){
      setErrorMessage('Hiba a küldésekor')

    }else{
      await load();
    }
    
  }
  return (
    

    <div className="container">
      <div>
        <form onSubmit={newPerson}>
          <label>Name: <br/>
            <input type="text" onChange={e => setName(e.currentTarget.value)} />
          </label>
          <label>Age:<br/>
            <input type='number' onChange={e=> setAge(parseInt(e.currentTarget.value))}/>
          </label>
          <label>City:<br/>
            <input type="text" onChange={e=>setCity(e.currentTarget.value)} />
          </label>
          <input type="submit" value="New Person" />
        </form>
      </div>

      <h1>People</h1>
      <div>
      { 
        errorMessage != '' ? <div className='alert alert-danger'>{errorMessage}</div> : null
       }
      <label>
        Search by name or ID:
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
                onClick={()=> deletePeron(person)}>
                  Remove
                  </button>
                  <button className='btn btn-primary'
                  onClick={()=>addOneYear(person)}>
                    Age++ 🍰
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
}

export default App
