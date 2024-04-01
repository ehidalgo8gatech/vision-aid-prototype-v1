import { Table as ReactTable } from 'react-bootstrap';

export default function Table(props) {
  const { columns = [], rows } = props;

  return (
    <ReactTable striped bordered hover responsive>
      <thead>
        <tr>
          { columns.map((c, i) => <th key={`${c}-${i}`}><i>{c}</i></th> ) }
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </ReactTable>
  );
}
