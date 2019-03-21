import React from 'react';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Task from './task';

const Container = styled.div`
  margin: 8px;
  background-color: white;
	border: 1px solid lightgrey;
  border-radius: 2px;
  width: 220px;

  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 8px;
`;
/*min-height if empty list*/
const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'inherit')};
  flex-grow: 1;
  min-height: 100px;
`;

class InnerList extends React.PureComponent {
  render() {
    return this.props.tasks.map((task,index) => (
      <Task key={task.id} task={task} index={index} />
    ));
  }
}

//direction is vertical by default - set direction="horizontal" on droppable

//type is shared among draggable and droppable to know whether
//a task matches container it is being moved to

//e.g. type={this.props.column.id === 'column-3' ? 'done' : 'active'}
//conditionally allow task to be dropped in progress column but not done column

//isDropDisabled={this.props.isDropDisabled} - if set true, nothing can be dropped
//on it even if type matches. Can use this dynamically even during a move
//in this case - tasks can only move to right of where started

//draggableProps and dragHandleProps do not need to be on the same element - 
//when we made cols draggable, we put the handle on the title
export default class Column extends React.Component {
	render() {
		return (
      <Draggable draggableId={this.props.column.id} index={this.props.index}>
        {(provided) => (
        <Container
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <Title {...provided.dragHandleProps}> 
             {this.props.column.title}
          </Title>
          <Droppable 
            droppableId={this.props.column.id}
            isDropDisabled={this.props.isDropDisabled}
            type="task"
            >
              {(provided, snapshot) => (
                <TaskList 
                ref={provided.innerRef} 
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
                >
                <InnerList tasks={this.props.tasks}/>
                {provided.placeholder}
                </TaskList>
                )}
          </Droppable>
        </Container>
        )}
        </Draggable>
		);
	}
}