import React, {useState, useEffect} from 'react'
import {db, addDoc, collection, getDocs, doc, deleteDoc, getDoc, updateDoc} from './firebaseconfig'




const App = () => {

  const [editar, setEditar] =useState(null)
  const [idUsuario, setIdUsuario] =useState('')
  const [nombre, setNombre] =useState('')
  const [phone, setPhone] = useState('')
  const [usuario, setUsuario] = useState([])
  const [error, setError] = useState('')

  useEffect(()=> {
    const getUsuarios = async () => {
      //Mapeamos la respuesta de firestore, devolvemos un objeto guardandolo en un array
      //Guardamos la propiedad de "id", y extraemos la propiedad "data" con rest leyendo toda su info
      const {docs} = await getDocs(collection(db, 'agenda'));
      const nuevoArray = docs.map (item => ({id:item.id, ...item.data()}));
      setUsuario(nuevoArray);
    }
    getUsuarios()
  },[])

  const addUsuarios = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !phone.trim()) {
      setError('Error: Campo nombre y/o teléfono vacíos');
      return; // Add a return statement to exit the function if there are empty fields
    }
    const usuario = {
      nombre: nombre,
      telefono: phone
    };
    try {
      const docRef = await addDoc(collection(db, 'agenda'), usuario);
      const {docs} = await getDocs(collection(db, 'agenda'));
      const nuevoArray = docs.map (item => ({id:item.id, ...item.data()}));
      setUsuario(nuevoArray);
      alert("Documento añadido con éxito");
    } catch (error) {
      console.error("Error al añadir el documento:", error);
    }
    setNombre('')
    setPhone('')
  };

  const deleteUsuario = async (id) => {

    try{
      await deleteDoc(doc(db, "agenda", id));
      const {docs} = await getDocs(collection(db, 'agenda'));
      const nuevoArray = docs.map (item => ({id:item.id, ...item.data()}));
      setUsuario(nuevoArray);

    }catch (error) {
      console.log(error)
    }
  }

  const actualizarUsuario = async (id) => {

    try {
      const data = await getDoc(doc(db, 'agenda', id));
      const {nombre, telefono} = data.data()
      setNombre(nombre)
      setPhone(telefono)
      setIdUsuario(id)
      setEditar(true)
      console.log(id)

    }catch (error) {
      console.log(error)
    }
    
  }

  const setUpdate = async (e) => {
    e.preventDefault()
    if (!nombre.trim() || !phone.trim()) {
      setError('Error: Campo nombre y/o teléfono vacíos');
      return;
    }

    const userUpdate = {
      nombre:nombre,
      telefono:phone
    }

    try {
      await updateDoc(doc(db, 'agenda', idUsuario), userUpdate);
      const {docs} = await getDocs(collection(db, 'agenda'));
      const nuevoArray = docs.map (item => ({id:item.id, ...item.data()}));
      setUsuario(nuevoArray);

    } catch (error) {
      console.log(error)
    }
    setNombre('')
    setPhone('')
    setIdUsuario('')
    setEditar(false)
  }



  return (
    <div className='container'>
        <div className="row">
          <div className="col">
            <h2>Formulario de Usuarios</h2>
            <form onSubmit={editar? setUpdate : addUsuarios} className='form-group'>
              <input 
                value={nombre}
                onChange={(e)=>{setNombre(e.target.value)}}
                className="form-control" 
                placeholder="Introduce el nombre" 
                type="text" 
              />
              <input 
                value={phone}
                onChange={(e)=>{setPhone(e.target.value)}}
                className="form-control mt-3" 
                placeholder="Introduce el numero" 
                type="text" 
              />
              {
                editar ?
                (<input className="btn btn-success w-100 mt-3" value="Editar" type="submit" />)
                :
                (<input className="btn btn-dark w-100 mt-3" value="Registrar" type="submit" />)
              }
              
            </form>
            { 
          error ? 
          (
            <div className="alert alert-danger mt-4" role="alert">
              {error}
            </div>
          )
          :
          (
            <span></span>
          )
        }
          </div>
          <div className="col">
            <h2>Lista de Usuarios</h2>
            <ul className='list-group'>
            {
              usuario.length !==0 ?
              (
                usuario.map(item => (
                  <li className='list-group-item' key={item.id}>
                    {item.nombre} -- {item.telefono}
                    <button onClick={(id)=>{deleteUsuario(item.id)}} className='btn btn-danger float-end'>Eliminar</button>
                    <button onClick={(id)=>{actualizarUsuario(item.id)}} className='btn btn-info mx-3 float-end'>Actualizar</button>
                  </li>
                ))
              )
              :
              (<div className="alert alert-danger mt-4" role="alert">
              No hay tareas que mostrar
              </div>)
            }
            </ul>
          </div>
        </div>
        
    </div>
  )
}

export default App