import React, { useState, useEffect } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {
	//LOGICA
	const todosURL = "https://playground.4geeks.com/todo/"

	//fetch( url de la API, metodos, body, info es un json)
	//.then( codigo de status y el mensaje, aqui se convierte de JSON a JS)
	//.then( manejar la información que nos llego de la API)
	//.catch( si algo sale mal en el código de aqui es donde obtenemos la info del error)
	// Si el metodo no se especifica en el fetch, lo interpreta como un GET
	/*
	fetch(getTodosURL)
	.then((response)=>{console.log(response)
		return response.json()
	})
	.then((data)=>{console.log(data)})
	.catch((error)=>{error})
	*/
	const [todos, setTodos] = useState([]);
	const [newTodoLabel, setNewTodoLabel] = useState({label: "", is_done: false});
	const [editingIndex, setEditingIndex] = useState(null);
	
	const fetchTodos = () => {
		fetch(todosURL + 'users/hola-mundo2/')
		.then(response => response.json())
		.then(data => {
			setTodos(data.todos)
		})
		.catch()
	};
	

	/*const newTodo = {
		"label": "lavar la ropa"
	}*/

	const addTodo = () => {
        fetch(todosURL + 'todos/hola-mundo2', {
            method: "POST",
            body: JSON.stringify(newTodoLabel),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("Nuevo TODO añadido:", data);
                // Refetch TODOS para actualizar la lista
                fetchTodos();
				//Limpiar el Input
				setNewTodoLabel("");
            })
            .catch(error => console.error("Error añadido:", error));
    };


	const updateTodo = (todoId, updatedTodo) => {
		
		//Realizar la solicitud PUT a la API
		fetch(todosURL + 'todos/' + todoId, {
			method: "PUT",
			body: JSON.stringify(updatedTodo),
            headers: {
                'Content-Type': 'application/json'
            }
		})
		.then(response => {
			if (!response.ok) throw Error(response.statusText);
			return response.json();
		})
		.then(response => {
			console.log('Tarea actualizada con éxito:', response);
			//Actualizar la lista de TODOS después de la actualización
			fetchTodos();
		})
		.catch(error => console.log('Error al actualizar la tarea:', error));
	}


	const deleteTodo = index => {
		//Obtener el ID del TODO a eliminar
		const todoId = todos[index].id;

		//Realizar la solicitud DELETE a la API
		fetch(todosURL + 'todos/' + todoId, {
			method: "DELETE"
		})
			.then(response => {
				//Verificar si la solicitud fue exitosa
				if (!response.ok) {
					throw new Error("Error al eliminar el TODO")
				}
				//Actualizar el estado eliminando el TODO del array
				setTodos(todos.filter((_, idx) => idx !== index));
				console.log("TODO eliminado exitosamente");
			})
			.catch(error => console.log("Error al eliminar el TODO:", error));
    };


	useEffect(() => {
        fetchTodos();
    }, []);


	return (
		<div className='container-fluid background-GrayLight p-5'>
			<div>
				<h1 className='text-center font-color-grey font-size-55 mt-3'>ToDo's</h1>
				<input type="text" className="form-control shadow-lg fs-2 font-color-grey" aria-label="Sizing example input"  placeholder="Agregar una nueva tarea" 
					aria-describedby="inputGroup-sizing-default"  
					
					value = {newTodoLabel.label || ""}
					onChange={(e) => setNewTodoLabel({ label: e.target.value, is_done: false})} 

					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							addTodo(newTodoLabel.label);
						}
					}}
				/>
			</div>
				{/*<button className="btn btn-primary" onClick={addTodo}>Agregar tarea</button>*/}
			{todos && todos.length > 0 ? (
				<ul className='list-group shadow-lg'>
					{todos.map((item, index) => (
						<li key={index} className='d-flex justify-content-between list-group-item font-color-grey fs-2 px-5'>
							{editingIndex === index ? (
								<input type="text" value={item.label} onChange={(e) => {
									const updatedTodo = { ...item, label: e.target.value };
									updateTodo(item.id, updatedTodo);
								}} />
							) : (
								<div onClick={() => setEditingIndex(index)}>{item.label}</div>
							)}
							<button className='btn' onClick={() => deleteTodo(index)}>
								<span className='hidden-iconDelete fw-bold fs-3'>X</span>
							</button>
						</li>
					))}
					<li className='list-group-item font-color-grey fs-5 text-start px-5'>{todos.length} item left</li>
            	</ul>
		) : (   
			<p className='mb-5 font-color-greyDark fw-bold text-center'>No hay tareas, añadir tareas</p>
        )}
		</div>
	);
};

export default Home;
