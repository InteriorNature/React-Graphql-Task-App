import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
	background-color: ${props => 
		props.isDragDisabled 
		  ? 'lightgrey'
			: props.isDragging 
				? 'lightgreen' 
				: 'white'};
  display: flex;
	`;

const Handle = styled.div`
	width: 20px;
	height: 20px;
	background-color: orange;
	border-radius: 4px;
	margin-right: 8px;

	/* need this in react-beautiful-dnd if task shape circle or some other shape*/
	&:focus {
		outline:none;
		border-color:red;
	}
`;
//snapshot contains props for styling component during a drag
export default class Task extends React.Component {
	render() {
		const isDragDisabled = this.props.task.id === 'task-1';
		return (
		<Draggable 
				draggableId={this.props.task.id} 
				index={this.props.index}
				isDragDisabled={isDragDisabled}
				>
		  {(provided, snapshot) => (
			<Container
			  {...provided.draggableProps}
			  {...provided.dragHandleProps}
				ref={provided.innerRef}
				isDragging={snapshot.isDragging}
				isDragDisabled={isDragDisabled}
				aria-roledescription="Press space bar to lift the task"
			>
			<Handle {...provided.dragHandleProps}/>
			{this.props.task.content} 
			</Container>
		  )}
		</Draggable>
		);
	}
}