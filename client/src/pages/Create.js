import react, { useEffect, useState } from "react";
import { useEth } from '../contexts/EthContext';
import Accordion from "../components/base/Accordion";
import AccordionHeader from "../components/base/AccordionHeader";
import Button from "../components/base/Button";
import Card from "../components/base/Card";
import Checkbox from "../components/base/Checkbox";
import Image from "../components/base/Image";
import Select from "../components/base/Select";
import TextInput from "../components/base/TextInput";
import { Colors } from "../constants/Colors";
import {AiOutlineSearch} from 'react-icons/ai';
import Header from "../components/Header";
import "../styles/Create.css"

const EVENT_TYPES = ["Concert", "Festival", "Sport"]

const Create = () => {
  const [eventFactory, setEventFactory] = useState()

  const {
    state: { eventContract },
  } = useEth();

  const formInputs = [
    {
      id: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Soiree Alyra',
      onchange: (event) => setEventFactory(
        {
          ...eventFactory,
          name: event.target.value
        }
      )
    },
    {
      id: 'date',
      label: 'Date',
      type: 'date',
      placeholder: '12/02/2022',
      onchange: (event) => setEventFactory(
        {
          ...eventFactory,
          date: event.target.value
        }
      )
    },
    {
      id: 'location',
      label: 'Location',
      type: 'text',
      placeholder: 'Paris',
      onchange: (event) => setEventFactory(
        {
          ...eventFactory,
          location: event.target.value
        }
      )
    },
    {
      id: 'image',
      label: 'Image',
      type: 'text',
      placeholder: 'https://imgurl.com',
      onchange: (event) => setEventFactory(
        {
          ...eventFactory,
          image: event.target.value
        }
      )
    }
  ]

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log(eventFactory)

    if (typeof eventFactory == 'undefined') return

    const res = await eventContract.createEvent(
      eventFactory.name,
      eventFactory.date,
      eventFactory.location,
      eventFactory.image,
      eventFactory.ticketName,
      eventFactory.ticketSymbol,
      eventFactory.ticketPrice,
      eventFactory.maxTicketSupply,
      eventFactory.ticketURI
    );

    console.log(res)
  }

  const selectBoxOnChange = (value) => {
    console.log(value)
  }

  return (
    <div id="create">
      <Header />
      <form
        id='form-create-event'
        onSubmit={handleSubmit}
      >
        <div id="form-input">
          <label id='form-label' htmlFor='select-event-type'>
            Type
          </label>
          <Select
            id='select-event-type'
            items={EVENT_TYPES}
            onChange={value => selectBoxOnChange(value)}
          />
        </div>
        
        {
          formInputs.map((input) => (
            <div
              key={input.id}
              id='form-input'
            >
              <label id='form-label' htmlFor={input.id} className="block text-gray-700 text-sm font-bold mb-2">
                {input.label}
              </label>
              <TextInput
                id={input.id}
                width="250px"
                height="30px"
                type={input.type}
                placeholder={input.placeholder}
                aria-label={input.label}
                onChange={event => input.onchange(event)}
                required
              />
            </div>
          ))
        }
        <div id="form-button">
          <Button
            width="200px"
            height="50px"
            textContent="Create Event"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default Create;
