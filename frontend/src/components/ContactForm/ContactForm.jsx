import { Modal, Form } from "react-bootstrap";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import CustomLoadingButton from "../../FormButton/FormButton";
import "./ContactForm.css"
import useToast from "../../../hooks/useToast";
function ContactForm({showModal, onClose}) {
    const initialState = {
        name: "",
        email: "",
        message: "",
      };

     
      const [{ name, email, message }, setState] = useState(initialState);
      const [isLoading, setIsLoading] = useState(false);
      const { setToast } = useToast();
      const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
      };

      const clearState = () => setState({ ...initialState });

      const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        emailjs
          .sendForm(
            "service_k28mkgg",
            "template_nwnryd2",
            e.target,
            "GqIPDLi1bt3EKjqZK"
          )
          .then(
            (result) => {
              clearState();
              setToast({ variant: "success", message: "Message sent!"});
              onClose();
            },
            (error) => {
              setToast({ variant: "danger", message: "Failed to send message. Please try again." });
            }
          )
          .finally(() => setIsLoading(false));
      };
  return <Modal show={showModal} onHide={onClose} style={{ zIndex: 15000 }}>
        <Modal.Header closeButton>
          <Modal.Title>Contact Us</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your name"
                value={name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="email" className="mt-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="message" className="mt-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Your message"
                value={message}
                onChange={handleChange}
                required
                name="message"
              />
            </Form.Group>
            <CustomLoadingButton
              isLoading={isLoading}
              onClick={null}
              text="Send message"
              buttonType="submit"
              className="mt-3"
              id={"send-btn"}
            />
          </Form>
        </Modal.Body>
      </Modal>
  
}

export default ContactForm