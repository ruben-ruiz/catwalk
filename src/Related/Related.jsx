import React from "react";
import axios from 'axios';
import Slider from '../Widgets/Slider.jsx';
import Card from '../Widgets/Card.jsx';
import { Outfits } from './Outfits.jsx';
import {FaRegStar} from 'react-icons/fa';
import Comparison from './Comparison.jsx';
import Modal from 'react-modal';

class Related extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      isOpen: false
    }

    this.comparison = this.comparison.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  componentDidMount() {
    Modal.setAppElement('#app');
  }

  closeModal() {
    this.setState({
      isOpen: false
    });
  }

  openModal() {
    this.setState({
      isOpen: true
    });
  }

  async componentDidUpdate(prevProps) {
    if (this.props.related !== prevProps.related) {
      this.props.related.forEach(id => {
        axios
        .get(`/api/products/${id}`)
        .then(response => response.data)
        .then(details => {
          axios.get(`/api/products/${id}/styles`)
          .then(response => response.data)
          .then(styles => {
            details.styles = styles.results[0].photos;
            this.setState(prevState => ({
              products: prevState.products.concat([{
                details: details,
                images: styles.results[0].photos
              }])
            }))
          })
        })
      });
    }
  }

  comparison(id) {
    console.log(id);
  }

  render() {
    return (
      <div>
        <div className="related">
          <h2 className="related-text">RELATED PRODUCTS</h2>
          <div className="related-list carousel-list carousel-horizontal">
            <Slider>
            {this.state.products.map((product,index) =>
              <Card details={product.details} images={product.images} key={index} index={index}  cardClick={this.props.cardClick} btnClick={this.comparison} glyph={<FaRegStar />}/>
            )}
            </Slider>
          </div>
        </div>
        <Outfits product={this.props.product} styles={this.props.styles} cardClick={this.props.cardClick} />
        <button onClick={this.openModal}>open modal</button>
        <Modal isOpen={this.state.isOpen} onRequestClose={this.closeModal}>
          <Comparison />
        </Modal>
      </div>
    );
  }
}

export default Related;