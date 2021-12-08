import React, { Component } from 'react';
import Board from "@lourenci/react-kanban";
import { Row, Col } from "reactstrap";
import CardBox from "./CardBox";
import CardHeader from "./CardHeader";

class KanbanBoard extends Component {

    render() {
        const content = this.props.board;
        return (
            <React.Fragment>
                <Row className="mb-4">
                    <Col>
                        <Board
                            initialBoard={content}
                            renderColumnHeader={({ title, columnsubtitle}) => (
                                <CardHeader title={title} columnsubtitle={columnsubtitle}/>
                            )}
                            renderCard={({ content }, { dragging }) => (
                                <CardBox data={content} dragging={dragging}>
                                    {content}
                                </CardBox>
                            )}
                            onNewCardConfirm={draftCard => ({
                                id: new Date().getTime(),
                                ...draftCard
                            })}
                            allowAddCard={{ on: 'bottom' }}
                        />
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default KanbanBoard;