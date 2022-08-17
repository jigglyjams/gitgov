import {
  Link,
  Select,
  FormLabel,
  Input,
  Textarea,
  Button,
} from '@chakra-ui/react';
import { ChangeEvent, useState, useEffect } from 'react';
import { useFormik, Field } from 'formik';
import { spaces, proposalTypes } from '../constants';
import { Container } from '../components/Container';
import { DarkModeSwitch } from '../components/DarkModeSwitch';

const Index = () => {
  const [draftURL, setDraftURL] = useState(null);
  const [proposalContent, setProposalContent] = useState('');

  const formik = useFormik({
    initialValues: {
      space: '',
      category: 'Funding Cycle Reconfiguration',
      governanceCycle: '',
      author: '',
      recipient: '',
      amount: '',
      length: '',
      title: '',
      content: ''
    },
    onSubmit: async (values) => {
      formik.values.content = proposalContent;
      const res = await fetch('/api/github/pushDraftProposal', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
      const data = await res.json();
      if (data) {
        setDraftURL(data.url);
      }
    }
  });

  const fetchGovernanceCycle = async (event: ChangeEvent<HTMLSelectElement>) => {
    const response = await fetch('/api/github/fetchSpaceDefaults', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ space: event.target.value })
    });
    const data = await response.json();
    formik.setValues({
      ...formik.values,
      space: event.target.value,
      governanceCycle: String(Number(data.governanceCycle) + 1),
      length: String(Number(data.governanceCycle) + 8),
    });
    setProposalContent(data.proposalTemplate);
  };

  const proposalContentHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setProposalContent(event.target.value);
  };

  return (
    <Container width='50%' mt={50} pr={5} pl={5}>
      <DarkModeSwitch />
      { !draftURL ? (
          <form onSubmit={formik.handleSubmit}>
            <FormLabel>space</FormLabel>
            <Select placeholder='Select a space' onChange={fetchGovernanceCycle}>
              {spaces.map((space) => (
                <option key={space.key} value={space.value}>{space.value}</option>
              ))}
            </Select>
            <FormLabel htmlFor='category'>Proposal Type</FormLabel>
            <Select id='category' onChange={formik.handleChange} value={formik.values.category}>
              {proposalTypes.map((type) => (
                <option key={type.key} value={type.value}>{type.value}</option>
              ))}
            </Select>
            <FormLabel htmlFor='governanceCycle'>Governance Cycle</FormLabel>
            <Input type='number' id='governanceCycle' onChange={formik.handleChange} value={formik.values.governanceCycle} />
            <FormLabel htmlFor='author'>Author</FormLabel>
            <Input id='author' onChange={formik.handleChange} value={formik.values.author} />
            <FormLabel htmlFor='recipient'>Payout Address</FormLabel>
            <Input id='recipient' onChange={formik.handleChange} value={formik.values.recipient} />
            <FormLabel htmlFor='amount'>Amount (USD)</FormLabel>
            <Input id='amount' onChange={formik.handleChange} value={formik.values.amount} />
            <FormLabel htmlFor='length'>Payment End Governance Cycle</FormLabel>
            <Input id='length' onChange={formik.handleChange} value={formik.values.length} />
            <FormLabel htmlFor='title'>Title</FormLabel>
            <Input id='title' onChange={formik.handleChange} value={formik.values.title}/>
            <FormLabel htmlFor='content'>Content</FormLabel>
            <Textarea id='content' height={1000} onChange={proposalContentHandler} value={proposalContent} />
            <Button colorScheme='green' variant={'outline'} type='submit'>commit draft</Button>
            <Button colorScheme='green'>publish</Button>
          </form>)
        : (
          <Link href={draftURL}>{draftURL}</Link>
        )}
    </Container>
  );
};

export default Index;
