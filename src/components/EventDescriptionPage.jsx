import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import HttpService from "../services/HttpService";
import { endPoint } from "../config.json";
import {addToCart} from "../redux/cartActions";
import { connect } from 'react-redux'

const mapStateToProps = state => {
  return {
    events: state.events
  }
}

const  mapDispatchToProps = dispatch => {
  return {
    addToCart: (event) => dispatch(addToCart(event))
  }
}

class EventDescriptionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfTickets: "",
      token: localStorage.getItem("idToken")
    };
    this.click1 = React.createRef();
  }

  onChangedesc = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  createOrder = () => {
    if (this.state.numberOfTickets > 0) {
      const formData = new FormData();
      formData.append("quantity", this.state.numberOfTickets);
      formData.append("price", this.props.ticketPrice);
      formData.append("id", this.props.eventId);
      const config = {
        headers: {
          Authorization: "Bearer " + this.state.token,
          "content-type": "form-data"
        }
      };

      return HttpService.post(
        endPoint + "/Order/create",
        formData,
        config
      ).then(res => {
        alert("Added to cart");
        this.state.numberOfTickets = 0;
      });
    }
  };

  render() {
    let  onAddToCart = () => {
      console.log("Add to cart Called")
      let event =  {...this.props.eventRecord}
      event.numTickets = parseInt(this.state.numberOfTickets, 10)
      this.props.addToCart(event)
      Close()
    }

          let Close = () => {
      if (this.state.token != null) {
        this.createOrder();
        this.setState({ open: false });
      } else {
        window.location = "/login";
      }
    };
    let handleShow = () => {
      this.setState({ open: true });
    };
    return (
      <div>
        <a onClick={handleShow} ref={this.click1} style={{ color: "#0000FF" }}>
          {this.props.name}
        </a>

        <Modal show={this.state.open} onHide={Close} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Book Tickets</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h1> {this.props.name} </h1>
            <Row>
              <Col>
                <img src={this.props.imageUrl} width="400px" height="400px" />
              </Col>
              <Col>
                <h5>Description:</h5>
                {this.props.description}
                <br />
                <h5>Tickets Available:</h5>
                {this.props.ticketsAvailable}
                <br />
                <h5>Ticket Price:</h5>
                {"$" + this.props.ticketPrice}
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <h3>Number of Tickets</h3>
            <input
              type="text"
              name="numberOfTickets"
              onChange={this.onChangedesc}
            />
            <Button variant="primary" onClick={onAddToCart}>
              Add To Cart
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventDescriptionPage)
