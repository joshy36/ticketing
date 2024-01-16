'use client';

import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  PersonIcon,
  RocketIcon,
} from '@radix-ui/react-icons';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';

import * as React from 'react';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { cn } from '../components/ui/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Marquee } from '@/components/ui/marquee';
import { dateToString } from '@/utils/helpers';

export default function Home() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(), // Set to the current date
    // to: addDays(new Date(), 5), // Set to the current date + 5 days
  });

  const data = [
    {
      id: '2e358cb8-248d-4918-84a9-01fc08346d92',
      created_at: '2023-11-25T01:09:25.83137+00:00',
      updated_at: '2024-01-10T17:18:43.355622+00:00',
      name: 'another one',
      description:
        'lkfjhaslkdjfhlaksdjhflkajshdflkjahsdflkjasdlkfjhaslkdjfhlaksjdhflkajhsdflkjahsdlkjfhaslkdjhfalkjsdhflajksdhflkjahsdflkjasd',
      date: '2024-01-03T01:30:00+00:00',
      image:
        'http://localhost:54321/storage/v1/object/public/events/2e358cb8-248d-4918-84a9-01fc08346d92/event_photo.jpeg?v=3464580801',
      tickets_remaining: 10,
      base_url: null,
      ipfs_image: null,
      etherscan_link: null,
      artist: '6c17e3a7-dd98-45f1-be56-28e5d64efaa1',
      created_by: '699d0320-769b-4999-a232-3f7517c8ff2a',
      venue: 'd62bd845-6b90-4cf8-93bc-ac7f874f8122',
      max_tickets_per_user: 2,
      stripe_product_id: 'prod_P4IzoO5Gp1uNom',
      organization_id: '6b75b512-bf2d-4cbb-9326-2694e5498fd0',
      venues: { name: 'Full Test' },
    },
    {
      name: 'Test',
      description:
        'a;sjlkdfh;alsjkdhflkjashdflkjahdflkjasdhflkjashdflkjahsdfkljashdf',
      date: '2024-01-24T01:30:00+00:00',
      image:
        'http://localhost:54321/storage/v1/object/public/events/3c3d1296-ef8b-4de8-8b6d-9ba59683d6ec/event_photo.jpeg?v=1338630838',
      tickets_remaining: -4,
      base_url:
        'https://ipfs.io/ipfs/bafybeieagjaqvtic5fioeatp4ei7sbbv7ej3iuihuj54y3wfye4n5fgreq',
      ipfs_image:
        'https://ipfs.io/ipfs/bafybeifyqx6phibhjykvgdzoc2n2vz52qx6jik4asthp7joe6hb4bfb7oy',
      etherscan_link:
        'https://goerli.basescan.org/address/0x1AFA485baE2c01E99E345F49e658219738E0A5B6',
      artist: '70cee8d9-5c67-437d-a83d-16c32b1dc948',
      created_by: '699d0320-769b-4999-a232-3f7517c8ff2a',
      venue: 'd62bd845-6b90-4cf8-93bc-ac7f874f8122',
      max_tickets_per_user: 2,
      stripe_product_id: 'prod_P6YuRsMTkDceY6',
      organization_id: '6b75b512-bf2d-4cbb-9326-2694e5498fd0',
      venues: { name: 'Full Test' },
    },
    // {
    //   id: '6fd1adce-5412-4210-aca3-917c8f550e71',
    //   created_at: '2023-11-27T18:16:23.926003+00:00',
    //   updated_at: '2024-01-10T17:18:46.810532+00:00',
    //   name: 'sbts',
    //   description: 'lkasjhdfa;lkhjsdflaksjhdflkjashdfkjlahsdflkjhasdfasdf',
    //   date: '2023-12-21T13:32:00+00:00',
    //   image:
    //     'http://localhost:54321/storage/v1/object/public/events/6fd1adce-5412-4210-aca3-917c8f550e71/event_photo.jpeg?v=4017555390',
    //   tickets_remaining: 11,
    //   base_url: null,
    //   ipfs_image: null,
    //   etherscan_link: null,
    //   artist: '6c17e3a7-dd98-45f1-be56-28e5d64efaa1',
    //   created_by: '699d0320-769b-4999-a232-3f7517c8ff2a',
    //   venue: '271b2c70-6801-4153-999b-a18498f6eb31',
    //   max_tickets_per_user: 2,
    //   stripe_product_id: 'prod_P5K0CSbVAgZOox',
    //   organization_id: '6b75b512-bf2d-4cbb-9326-2694e5498fd0',
    //   venues: { name: 'working' },
    // },
    // {
    //   id: 'a054c819-6f79-4e8a-a07f-af7983f8d126',
    //   created_at: '2023-11-29T04:27:26.139276+00:00',
    //   updated_at: '2024-01-10T17:18:49.870883+00:00',
    //   name: 'test4',
    //   description: 'afdskhasdjklfhalskdjfhkjsadfhjkakhjsdfhkjasdfjkjkahlfds',
    //   date: '2024-01-10T13:32:00+00:00',
    //   image: null,
    //   tickets_remaining: null,
    //   base_url: null,
    //   ipfs_image: null,
    //   etherscan_link: null,
    //   artist: '6c17e3a7-dd98-45f1-be56-28e5d64efaa1',
    //   created_by: '699d0320-769b-4999-a232-3f7517c8ff2a',
    //   venue: 'd62bd845-6b90-4cf8-93bc-ac7f874f8122',
    //   max_tickets_per_user: null,
    //   stripe_product_id: 'prod_P5r5fMkr3XRaQ7',
    //   organization_id: '6b75b512-bf2d-4cbb-9326-2694e5498fd0',
    //   venues: { name: 'Full Test' },
    // },
    // {
    //   id: '27c91658-c655-4902-97ad-9e6c908bbfeb',
    //   created_at: '2023-11-27T18:20:39.497321+00:00',
    //   updated_at: '2024-01-10T17:18:51.573561+00:00',
    //   name: 'collectibles/sbts',
    //   description: 'asdfdjakshfjkahsdfkjhaskjdhfkjashdfasdfasdf',
    //   date: '2023-11-30T13:30:00+00:00',
    //   image:
    //     'http://localhost:54321/storage/v1/object/public/events/27c91658-c655-4902-97ad-9e6c908bbfeb/event_photo.jpeg?v=2911519086',
    //   tickets_remaining: 11,
    //   base_url: null,
    //   ipfs_image: null,
    //   etherscan_link: null,
    //   artist: '6c17e3a7-dd98-45f1-be56-28e5d64efaa1',
    //   created_by: '699d0320-769b-4999-a232-3f7517c8ff2a',
    //   venue: '271b2c70-6801-4153-999b-a18498f6eb31',
    //   max_tickets_per_user: 2,
    //   stripe_product_id: 'prod_P5K4ezYZ6z1Y45',
    //   organization_id: '6b75b512-bf2d-4cbb-9326-2694e5498fd0',
    //   venues: { name: 'working' },
    // },
    // {
    //   id: 'f0ba626e-523e-4f97-b251-e60b05229584',
    //   created_at: '2023-11-22T20:40:17.02441+00:00',
    //   updated_at: '2024-01-10T17:18:53.489225+00:00',
    //   name: 'Test',
    //   description: 'kashjgdfkhjasgdfkjhagsdfkjhagsdkfjhgasdfadsfaadsaf',
    //   date: '2024-01-03T01:30:00+00:00',
    //   image:
    //     'http://localhost:54321/storage/v1/object/public/events/f0ba626e-523e-4f97-b251-e60b05229584/event_photo.jpeg?v=3242961602',
    //   tickets_remaining: 5,
    //   base_url:
    //     'https://ipfs.io/ipfs/bafybeih67qtlafomde4f6djie45aqx36qg4ykjy2mx2vf5aii3objuzy4i',
    //   ipfs_image:
    //     'https://ipfs.io/ipfs/bafkreieyy5dlzwhcnqkpckd4q6tf6mjptygky3soc2li6trzo3daxo34xq',
    //   etherscan_link:
    //     'https://goerli.basescan.org/address/0x4858afe18b8D148c9152901Cd14373Fbe4AFF9fa',
    //   artist: '46b2b60e-f017-4389-84cb-9c0590ba7a59',
    //   created_by: '699d0320-769b-4999-a232-3f7517c8ff2a',
    //   venue: '271b2c70-6801-4153-999b-a18498f6eb31',
    //   max_tickets_per_user: 2,
    //   stripe_product_id: 'prod_P3UBp64oHcJgrO',
    //   organization_id: '6b75b512-bf2d-4cbb-9326-2694e5498fd0',
    //   venues: { name: 'working' },
    // },
    // {
    //   id: '3ff38f66-326f-4b5c-ae8f-c0ea236ac409',
    //   created_at: '2023-11-27T21:22:48.32013+00:00',
    //   updated_at: '2024-01-10T17:18:55.293464+00:00',
    //   name: 'TEST 2',
    //   description:
    //     'jkahsgdfkjhasgdfkjhasgdfkjhasgdfkjhagsdfkjhgasdkfjhgaskdjhfgasdf',
    //   date: '2024-01-02T01:30:00+00:00',
    //   image:
    //     'http://localhost:54321/storage/v1/object/public/events/3ff38f66-326f-4b5c-ae8f-c0ea236ac409/event_photo.jpeg?v=1851944597',
    //   tickets_remaining: 11,
    //   base_url:
    //     'https://ipfs.io/ipfs/bafybeie7hy5hz5jex5giy2q36nzlhnnv7czzsatu5iqc33skk72hnyrrpq',
    //   ipfs_image:
    //     'https://ipfs.io/ipfs/bafkreieyy5dlzwhcnqkpckd4q6tf6mjptygky3soc2li6trzo3daxo34xq',
    //   etherscan_link: null,
    //   artist: '6c17e3a7-dd98-45f1-be56-28e5d64efaa1',
    //   created_by: '699d0320-769b-4999-a232-3f7517c8ff2a',
    //   venue: '271b2c70-6801-4153-999b-a18498f6eb31',
    //   max_tickets_per_user: 2,
    //   stripe_product_id: 'prod_P5N05XmHSttbnq',
    //   organization_id: '6b75b512-bf2d-4cbb-9326-2694e5498fd0',
    //   venues: { name: 'working' },
    // },
    // {
    //   id: '92f7b661-57ba-40f0-b660-ee3c8012c81d',
    //   created_at: '2023-12-09T18:12:51.709181+00:00',
    //   updated_at: '2024-01-10T17:18:59.229563+00:00',
    //   name: 'Time',
    //   description: 'asfjas;ldfjaskdf;jasldjf;asdkjfasdf',
    //   date: '2023-12-28T22:32:00+00:00',
    //   image: null,
    //   tickets_remaining: null,
    //   base_url: null,
    //   ipfs_image: null,
    //   etherscan_link: null,
    //   artist: '46b2b60e-f017-4389-84cb-9c0590ba7a59',
    //   created_by: '699d0320-769b-4999-a232-3f7517c8ff2a',
    //   venue: '8d0ce7fa-136c-43ff-bb90-93da69bd054a',
    //   max_tickets_per_user: null,
    //   stripe_product_id: 'prod_P9oes5UYmJdqjE',
    //   organization_id: '6b75b512-bf2d-4cbb-9326-2694e5498fd0',
    //   venues: { name: 'Big Venue' },
    // },
    // {
    //   id: '66bf0026-6a75-4f76-b181-ea4331c17f10',
    //   created_at: '2023-12-01T02:46:51.526495+00:00',
    //   updated_at: '2024-01-10T17:19:01.038001+00:00',
    //   name: 'retry test',
    //   description:
    //     'fa;sldfjals;kdfj;lasjdf;laskjdf;laksjdf;lkajsdf;lkasdfasdfasdf',
    //   date: '2023-12-06T10:32:00+00:00',
    //   image:
    //     'http://localhost:54321/storage/v1/object/public/events/66bf0026-6a75-4f76-b181-ea4331c17f10/event_photo.jpeg?v=911587303',
    //   tickets_remaining: -5,
    //   base_url:
    //     'https://ipfs.io/ipfs/bafybeiar24t6zlhv2jfbmnyw75ki27dgtvf4s6qcybice2565ws5efrzgy',
    //   ipfs_image:
    //     'https://ipfs.io/ipfs/bafkreicdb77gktobhevv4juiphxwkvgxlytw7fzms7qhf3qd6kfhaj6qju',
    //   etherscan_link:
    //     'https://goerli.basescan.org/address/0xBF16042CB822F836c2fB0466f984e386e9B4874D',
    //   artist: '70cee8d9-5c67-437d-a83d-16c32b1dc948',
    //   created_by: '699d0320-769b-4999-a232-3f7517c8ff2a',
    //   venue: '271b2c70-6801-4153-999b-a18498f6eb31',
    //   max_tickets_per_user: 2,
    //   stripe_product_id: 'prod_P6ZuSnHsJLxd5a',
    //   organization_id: '6b75b512-bf2d-4cbb-9326-2694e5498fd0',
    //   venues: { name: 'working' },
    // },
    // {
    //   id: '972aaf27-c88c-44f8-865b-c473bbdeca29',
    //   created_at: '2023-12-09T18:15:02.045511+00:00',
    //   updated_at: '2024-01-10T17:19:03.111125+00:00',
    //   name: 'Time 2',
    //   description: 'asdfl;ajsdflka;sldfjl;asdfadsf',
    //   date: '2023-12-28T22:32:00+00:00',
    //   image: null,
    //   tickets_remaining: null,
    //   base_url: null,
    //   ipfs_image: null,
    //   etherscan_link: null,
    //   artist: '6c17e3a7-dd98-45f1-be56-28e5d64efaa1',
    //   created_by: '699d0320-769b-4999-a232-3f7517c8ff2a',
    //   venue: '8d0ce7fa-136c-43ff-bb90-93da69bd054a',
    //   max_tickets_per_user: null,
    //   stripe_product_id: 'prod_P9ogLuZln2jzRz',
    //   organization_id: '6b75b512-bf2d-4cbb-9326-2694e5498fd0',
    //   venues: { name: 'Big Venue' },
    // },
    // {
    //   id: '6d53137b-ae23-430c-9621-3f8e16675ca3',
    //   created_at: '2024-01-10T17:09:58.600761+00:00',
    //   updated_at: '2024-01-10T17:10:25.664469+00:00',
    //   name: 'test',
    //   description:
    //     'dsfg fdgsdfgd sfgsdfgds gs df dsfgs dfgsd fgs dfs dfgsdfgsd fgs dfgdsf gsdfgs dfg sdfg',
    //   date: '2024-01-19T13:30:00+00:00',
    //   image:
    //     'http://localhost:54321/storage/v1/object/public/events/6d53137b-ae23-430c-9621-3f8e16675ca3/event_photo.jpeg?v=582495020',
    //   tickets_remaining: 10,
    //   base_url: null,
    //   ipfs_image: null,
    //   etherscan_link: null,
    //   artist: '70cee8d9-5c67-437d-a83d-16c32b1dc948',
    //   created_by: '699d0320-769b-4999-a232-3f7517c8ff2a',
    //   venue: 'd62bd845-6b90-4cf8-93bc-ac7f874f8122',
    //   max_tickets_per_user: 4,
    //   stripe_product_id: 'prod_PLmryUGxTiqVJt',
    //   organization_id: '6b75b512-bf2d-4cbb-9326-2694e5498fd0',
    //   venues: { name: 'Full Test' },
    // },
    // {
    //   id: '6c59a35a-e1e6-46f9-8ae5-8c05952a548b',
    //   created_at: '2023-12-01T03:19:54.389962+00:00',
    //   updated_at: '2024-01-10T17:18:56.974885+00:00',
    //   name: 'another retry',
    //   description:
    //     'lasdfhaksjdflkajshdflkjahsdfhasdfjhalskdjfhalsdjfdsfljalsdkjfhlaskdjfh',
    //   date: '2024-01-16T01:30:00+00:00',
    //   image:
    //     'http://localhost:54321/storage/v1/object/public/events/6c59a35a-e1e6-46f9-8ae5-8c05952a548b/event_photo.jpeg?v=4107385502',
    //   tickets_remaining: 0,
    //   base_url:
    //     'https://ipfs.io/ipfs/bafybeidehqr4ldxrmugqidijidvkraq6zqoynmxj636pxu2jq6glfbfui4',
    //   ipfs_image:
    //     'https://ipfs.io/ipfs/bafkreicdb77gktobhevv4juiphxwkvgxlytw7fzms7qhf3qd6kfhaj6qju',
    //   etherscan_link:
    //     'https://goerli.basescan.org/address/0x7DeAf24379dc373136735624864cf3304Ed6d867',
    //   artist: '70cee8d9-5c67-437d-a83d-16c32b1dc948',
    //   created_by: '699d0320-769b-4999-a232-3f7517c8ff2a',
    //   venue: '8d0ce7fa-136c-43ff-bb90-93da69bd054a',
    //   max_tickets_per_user: 2,
    //   stripe_product_id: 'prod_P6aRJ8LGhHQMjo',
    //   organization_id: '6b75b512-bf2d-4cbb-9326-2694e5498fd0',
    //   venues: { name: 'Big Venue' },
    // },
    // {
    //   id: '04f29b8c-3a4d-48df-bf94-03ca7a36f19c',
    //   created_at: '2023-12-06T23:00:12.872255+00:00',
    //   updated_at: '2024-01-10T17:19:05.213963+00:00',
    //   name: 'Qu',
    //   description: 'adskljfhalsdkjfhlkasdfasdfasdfasdfasdfasdfasdfasdfasdf',
    //   date: '2023-12-29T01:30:00+00:00',
    //   image:
    //     'http://localhost:54321/storage/v1/object/public/events/04f29b8c-3a4d-48df-bf94-03ca7a36f19c/event_photo.jpeg?v=383781200',
    //   tickets_remaining: 8,
    //   base_url:
    //     'https://ipfs.io/ipfs/bafybeiarmxxehurzvpcpfaji3hgweifp6o67h6eqm3jwwbrjfxknvzrrda',
    //   ipfs_image:
    //     'https://ipfs.io/ipfs/bafybeifyqx6phibhjykvgdzoc2n2vz52qx6jik4asthp7joe6hb4bfb7oy',
    //   etherscan_link:
    //     'https://goerli.basescan.org/address/0xb2C158f251A3190481f2274B8A4A670c866bC8Be',
    //   artist: '6c17e3a7-dd98-45f1-be56-28e5d64efaa1',
    //   created_by: '699d0320-769b-4999-a232-3f7517c8ff2a',
    //   venue: '8d0ce7fa-136c-43ff-bb90-93da69bd054a',
    //   max_tickets_per_user: 2,
    //   stripe_product_id: 'prod_P8lbEFUO5b0Hn3',
    //   organization_id: '6b75b512-bf2d-4cbb-9326-2694e5498fd0',
    //   venues: { name: 'Big Venue' },
    // },
    // {
    //   id: 'efd7f27d-9a5a-4eab-92e0-5e701d2e9c17',
    //   created_at: '2023-12-01T16:14:46.670071+00:00',
    //   updated_at: '2024-01-10T17:19:07.274132+00:00',
    //   name: 'date check',
    //   description:
    //     'afasdkfhaskjdhfalksdhjfakjhflkashdjfajsdfaklfhalksdjfhkjlasdhfkajdsf',
    //   date: '2023-12-11T01:30:00+00:00',
    //   image:
    //     'http://localhost:54321/storage/v1/object/public/events/efd7f27d-9a5a-4eab-92e0-5e701d2e9c17/event_photo.jpeg?v=3640449433',
    //   tickets_remaining: 10,
    //   base_url: null,
    //   ipfs_image: null,
    //   etherscan_link: null,
    //   artist: '70cee8d9-5c67-437d-a83d-16c32b1dc948',
    //   created_by: '699d0320-769b-4999-a232-3f7517c8ff2a',
    //   venue: 'd62bd845-6b90-4cf8-93bc-ac7f874f8122',
    //   max_tickets_per_user: 2,
    //   stripe_product_id: 'prod_P6mwXOcmCvsKaT',
    //   organization_id: '6b75b512-bf2d-4cbb-9326-2694e5498fd0',
    //   venues: { name: 'Full Test' },
    // },
    // {
    //   id: 'b48c96a3-a741-4b32-9bff-513fc8b1252b',
    //   created_at: '2023-12-09T18:16:44.375981+00:00',
    //   updated_at: '2024-01-10T17:19:09.038901+00:00',
    //   name: 'Time 3',
    //   description: 'asdlfjjalskdfjl;asdf;alsdfasdfasdfasdfasdf',
    //   date: '2023-12-28T17:32:00+00:00',
    //   image: null,
    //   tickets_remaining: 40,
    //   base_url: null,
    //   ipfs_image: null,
    //   etherscan_link: null,
    //   artist: '70cee8d9-5c67-437d-a83d-16c32b1dc948',
    //   created_by: '699d0320-769b-4999-a232-3f7517c8ff2a',
    //   venue: '8d0ce7fa-136c-43ff-bb90-93da69bd054a',
    //   max_tickets_per_user: 2,
    //   stripe_product_id: 'prod_P9oihTu7AuWmL8',
    //   organization_id: '6b75b512-bf2d-4cbb-9326-2694e5498fd0',
    //   venues: { name: 'Big Venue' },
    // },
    // {
    //   id: '3b2b8b53-9036-4a18-a318-ab39684992ee',
    //   created_at: '2024-01-03T22:47:54.303858+00:00',
    //   updated_at: '2024-01-10T17:19:10.762437+00:00',
    //   name: 'test',
    //   description: 'asdfasdfasdfasdfasdfasdfasdfasdf',
    //   date: '2024-02-01T01:30:00+00:00',
    //   image:
    //     'http://localhost:54321/storage/v1/object/public/events/3b2b8b53-9036-4a18-a318-ab39684992ee/event_photo.jpeg?v=1308681824',
    //   tickets_remaining: 11,
    //   base_url: null,
    //   ipfs_image: null,
    //   etherscan_link: null,
    //   artist: '70cee8d9-5c67-437d-a83d-16c32b1dc948',
    //   created_by: '699d0320-769b-4999-a232-3f7517c8ff2a',
    //   venue: '271b2c70-6801-4153-999b-a18498f6eb31',
    //   max_tickets_per_user: 4,
    //   stripe_product_id: 'prod_PJFjhNjWn4dVF0',
    //   organization_id: '6b75b512-bf2d-4cbb-9326-2694e5498fd0',
    //   venues: { name: 'working' },
    // },
    // {
    //   id: '8c54966f-7a80-4776-942d-0388d190f818',
    //   created_at: '2024-01-10T17:30:46.877204+00:00',
    //   updated_at: '2024-01-10T17:31:09.498985+00:00',
    //   name: 'org',
    //   description:
    //     'sadf asdf asdf asdf asdf sa d fa dfasdfasd fads fsdafasd ads f dsafasdf asdfa sdf dafd sd f',
    //   date: '2024-01-20T01:30:00+00:00',
    //   image:
    //     'http://localhost:54321/storage/v1/object/public/events/8c54966f-7a80-4776-942d-0388d190f818/event_photo.jpeg?v=1373340816',
    //   tickets_remaining: 10,
    //   base_url: null,
    //   ipfs_image: null,
    //   etherscan_link: null,
    //   artist: '6c17e3a7-dd98-45f1-be56-28e5d64efaa1',
    //   created_by: '699d0320-769b-4999-a232-3f7517c8ff2a',
    //   venue: 'd62bd845-6b90-4cf8-93bc-ac7f874f8122',
    //   max_tickets_per_user: 4,
    //   stripe_product_id: 'prod_PLnCsTvIpdoNKs',
    //   organization_id: '6b75b512-bf2d-4cbb-9326-2694e5498fd0',
    //   venues: { name: 'Full Test' },
    // },
  ];

  return (
    <main>
      <div className='flex flex-row items-center justify-center'>
        <p className='z-30 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text pt-20 text-center text-4xl font-bold tracking-tighter text-transparent md:pr-4 md:text-6xl lg:pr-8 lg:text-8xl'>
          Discover new events.
        </p>
      </div>

      <div className='z-0 -mt-36 flex items-center justify-center'>
        <div className='b z-0 h-96 w-full'></div>
        <div className='b2 z-0 h-96 w-full'></div>
      </div>

      <div className='z-30 mx-auto -mt-36 flex max-w-md flex-row items-center justify-center gap-2  sm:px-6 sm:py-4 lg:max-w-3xl lg:px-6'>
        <div className={cn('grid gap-2')}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id='date'
                variant={'outline'}
                className={cn(
                  'hidden h-12 w-[250px] justify-start rounded-md border-none bg-black/70 text-left font-normal backdrop-blur-3xl hover:bg-black/90 lg:flex',
                  !date && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'LLL dd, y')} -{' '}
                      {format(date.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(date.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                initialFocus
                mode='range'
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* <Command className='rounded-lg border shadow-md'>
          <CommandInput placeholder='Search events, artists, venues...' />
          <CommandList>
            <CommandEmpty></CommandEmpty>
            <CommandGroup heading='Suggestions'>
              <CommandItem>
                <CalendarIcon className='mr-2 h-4 w-4' />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <FaceIcon className='mr-2 h-4 w-4' />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem>
                <RocketIcon className='mr-2 h-4 w-4' />
                <span>Launch</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading='Settings'>
              <CommandItem>
                <PersonIcon className='mr-2 h-4 w-4' />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <EnvelopeClosedIcon className='mr-2 h-4 w-4' />
                <span>Mail</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <GearIcon className='mr-2 h-4 w-4' />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command> */}

        <Input
          className='z-30 h-12 w-80 rounded-md border-none bg-black/70 backdrop-blur-3xl hover:bg-black/90 md:w-96'
          placeholder='Search events, artists, venues'
        />

        <Button className='z-30 h-12 rounded-md bg-indigo-300/80 hover:bg-indigo-400/80'>
          Search
        </Button>
      </div>
      <div className='flex flex-row items-center justify-center pt-48'>
        <div className='w-full md:w-2/3'>
          <Marquee
            fade={true}
            pauseOnHover={true}
            className='gap-[3rem] [--duration:10s]'
            innerClassName='gap-[3rem] [--gap:3rem]'
          >
            {data.map((event: any) => (
              <a key={event.id} href={`/event/${event.id}`} className='group'>
                <div className='overflow-hidden rounded-lg'>
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt={event.description}
                      width={500}
                      height={500}
                      className='h-48 w-48 object-cover object-center transition duration-300 ease-in-out hover:scale-105'
                    />
                  ) : (
                    <Image
                      src='/fallback.jpeg'
                      alt='image'
                      width={500}
                      height={500}
                      className='h-48 w-48 object-cover object-center'
                    />
                  )}
                </div>
                <h1 className='mt-2 text-xl text-accent-foreground'>
                  {event.name}
                </h1>
                <p className='font-sm mt-0.5 text-sm text-muted-foreground'>
                  {`${dateToString(event.date)}`}
                </p>
                <p className='font-sm mt-0.5 text-sm text-muted-foreground'>
                  {`${event.venues.name}`}
                </p>
              </a>
            ))}
          </Marquee>
        </div>
      </div>

      <div className='flex flex-row items-center justify-center'>
        <p className='z-30 bg-gradient-to-r from-blue-600 to-blue-900 bg-clip-text pt-20 text-center text-4xl font-bold tracking-tighter text-transparent md:pr-4 md:text-6xl lg:pr-8 lg:text-8xl'>
          Build a community.
        </p>
      </div>

      <div className='z-0 -mt-36 flex items-center justify-center'>
        <div className='c z-0 h-96 w-full'></div>
        <div className='c2 z-0 h-96 w-full'></div>
      </div>
    </main>
  );
}
