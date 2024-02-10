type TransferTicket = {
  method: 'transferTicket';
  event_id: string;
  ticket_id: string;
  user_id: string;
};

type AnotherTransaction = {
  method: 'anotherMethod';
  event_id: string;
  user_id: string;
};

type JobType = TransferTicket | AnotherTransaction;

export type Payload = {
  id: number;
  url: string;
  body: JobType;
};
