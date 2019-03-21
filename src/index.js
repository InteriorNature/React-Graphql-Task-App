import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Column from './column';

const Container = styled.div`
	display: flex;
	flex-direction: row;
`;

//optimization to prevent tasks from re-rendering during a column container move
class InnerList extends React.PureComponent {
	render() {
		const { column, taskMap, index } = this.props;
		const tasks = column.taskIds.map(taskId => taskMap[taskId]);
		return <Column column={column} tasks={tasks} index={index} />;
	}
}

/*Drag-And-Drop functions for a list component. Note: cannot change
dimensions of element while dragging*/

class App extends React.Component {
	state=initialData;
	
	onDragStart = (start, provided) => {
		const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId);
		this.setState({
			homeIndex,
		});
		//screen reader
		provided.announce(`You have lifted the task in position ${start.source.index + 1}`,
		);
	};

	onDragUpdate = (update, provided) => {
		//screen reader
		const message = update.destination
		? `You have moved to task position ${update.destination.index + 1}`
		: `You are currently not over a droppable area`;
        
		provided.announce(message);
	};
	
	onDragEnd = (result, provided) => {
		this.setState({
			homeIndex: null,
		});
		//screen reader
		const message = result.destination
		? `You have moved the task from position ${result.source.index + 1}
			to ${result.destination.index + 1}`
		: `The task has been returned to its starting position of ${result.source.index + 1}`;
		provided.announce(message);
		 
		//document.body.style.color = 'inherit';
		//document.body.style.backgroundColor = 'inherit';
		
		/*reorders column/list data after a move - optimistic
		update of UI*/
		const { destination, source, draggableId, type } = result;

		if (!destination) {
			return;
		}
        //has user dropped in original location?
		if (
			destination.droppableID === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}
        //if moving entire task list/column
		if (type == 'column') {
			const newColumnOrder = Array.from(this.state.columnOrder);
			newColumnOrder.splice(source.index, 1);
			newColumnOrder.splice(destination.index, 0, draggableId);

			const newState = {
				...this.state,
				columnOrder: newColumnOrder,
			};
			this.setState(newState);
			return;
		};

		//move old taskId from old index to new index in the array
		const start = this.state.columns[source.droppableId];
		const finish = this.state.columns[destination.droppableId];
		
		if(start === finish) {
			const newTaskIds = Array.from(start.taskIds);
			newTaskIds.splice(source.index, 1);
			newTaskIds.splice(destination.index, 0, draggableId);

			//create column revision from drag and drop
			const newColumn = {
				...start,
				taskIds: newTaskIds,
			};

			const newState = {
				...this.state,
				columns: {
					...this.state.columns,
					[newColumn.id]: newColumn,
				},
			};

			this.setState(newState);
			return;
		}
		
		//Moving from one list to another
		const startTaskIds = Array.from(start.taskIds);
		startTaskIds.splice(source.index, 1);
		const newStart = {
			...start,
			taskIds: startTaskIds,
		};

		const finishTaskIds = Array.from(finish.taskIds);
		finishTaskIds.splice(destination.index, 0, draggableId);
		const newFinish = {
			...finish,
			taskIds: finishTaskIds,
		};

		const newState = {
			...this.state,
			columns: {
				...this.state.columns,
				[newStart.id]: newStart,
				[newFinish.id]: newFinish,
			},
		};
		this.setState(newState);
    };

	render() {
	return (
		<DragDropContext 
			onDragStart={this.onDragStart} 
			onDragUpdate={this.onDragUpdate}
			onDragEnd={this.onDragEnd}
			>
		<Droppable droppableId="all-columns" direction="horizontal" type="column">
			{provided => (
		<Container
		   {...provided.droppableProps}
		   ref={provided.innerRef}
		>
		{ this.state.columnOrder.map((columnId, index) => {
            const column = this.state.columns[columnId];
            const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);
			
			//need to fix - only disables first task moved into a new col
			//from being returned to previous col
			const isDropDisabled = (index < this.state.homeIndex);
			
			return (
				<InnerList 
					key={column.id} 
					column={column} 
					taskMap={this.state.tasks} 
					isDropDisabled={isDropDisabled}
					index={index}
					/>
			);
		})}
		{provided.placeholder}
		</Container>
		)}
		</Droppable>
	    </DragDropContext>
	    );
	}
}
ReactDOM.render(<App />, document.getElementById('root'));
