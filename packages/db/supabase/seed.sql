--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.3 (Ubuntu 15.3-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'ee40d28f-ced4-4229-9155-1fe7cdb179d3', '{"action":"user_confirmation_requested","actor_id":"e2e05c6d-1133-40fe-9fe3-c207bccb2cdb","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2023-08-18 04:19:29.832685+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a5624654-49db-41ca-ad97-8743780c50af', '{"action":"user_signedup","actor_id":"e2e05c6d-1133-40fe-9fe3-c207bccb2cdb","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"team"}', '2023-08-18 04:19:38.1115+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ca8d3e90-2275-446e-8e1c-a838cd2b63e7', '{"action":"login","actor_id":"e2e05c6d-1133-40fe-9fe3-c207bccb2cdb","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2023-08-18 04:20:02.453966+00', ''),
	('00000000-0000-0000-0000-000000000000', '0c86c85f-b025-4a44-ba91-0df4ea09f389', '{"action":"login","actor_id":"e2e05c6d-1133-40fe-9fe3-c207bccb2cdb","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2023-08-18 04:20:10.28633+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f6fa655d-00c0-426e-a391-9dea728e5b06', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"36bend@gmail.com","user_id":"e2e05c6d-1133-40fe-9fe3-c207bccb2cdb","user_phone":""}}', '2023-08-18 04:23:49.842408+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f27da2be-0bc1-45ab-b41a-26361c7e77cb', '{"action":"user_confirmation_requested","actor_id":"00e0c983-4b83-464e-90a3-a96c0d8236f5","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2023-08-18 04:26:18.305999+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f7bf61a6-7e65-41f3-8dca-abbc12473c1e', '{"action":"user_signedup","actor_id":"00e0c983-4b83-464e-90a3-a96c0d8236f5","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"team"}', '2023-08-18 04:26:24.712874+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ef0f0373-acc3-4708-ae84-7ca3ef53f04a', '{"action":"login","actor_id":"00e0c983-4b83-464e-90a3-a96c0d8236f5","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2023-08-18 04:27:01.421078+00', ''),
	('00000000-0000-0000-0000-000000000000', '21d5b667-0641-4192-b6c9-f9158f9b945a', '{"action":"logout","actor_id":"00e0c983-4b83-464e-90a3-a96c0d8236f5","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"account"}', '2023-08-18 04:27:04.28534+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bb7b4dc8-8fcf-4fae-b559-31f7d0104ff5', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"36bend@gmail.com","user_id":"00e0c983-4b83-464e-90a3-a96c0d8236f5","user_phone":""}}', '2023-08-18 04:30:25.045293+00', ''),
	('00000000-0000-0000-0000-000000000000', '2bb622de-00af-4b4a-b15b-d0fc9ee26582', '{"action":"user_confirmation_requested","actor_id":"3f496729-a687-4765-9ca8-ced6f660f813","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2023-08-18 04:31:25.417658+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ffb63594-31a4-40d5-a99a-0bae35b74787', '{"action":"user_signedup","actor_id":"3f496729-a687-4765-9ca8-ced6f660f813","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"team"}', '2023-08-18 04:31:31.086036+00', ''),
	('00000000-0000-0000-0000-000000000000', '06556883-fac1-4745-8d87-28ef81d939fa', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"36bend@gmail.com","user_id":"3f496729-a687-4765-9ca8-ced6f660f813","user_phone":""}}', '2023-08-18 04:33:41.903896+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c22b9e44-902d-49b7-89b6-7c899b02e35c', '{"action":"user_confirmation_requested","actor_id":"864262f9-bc87-4e78-9bec-0e1239ff8c0b","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2023-08-18 05:07:13.949875+00', ''),
	('00000000-0000-0000-0000-000000000000', '8ed95e0a-7d8e-4059-9c27-2ff5ce47272b', '{"action":"user_signedup","actor_id":"864262f9-bc87-4e78-9bec-0e1239ff8c0b","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"team"}', '2023-08-18 05:07:20.726706+00', ''),
	('00000000-0000-0000-0000-000000000000', '52ddf18e-ca21-4146-85e6-bb0f8fce774f', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"36bend@gmail.com","user_id":"864262f9-bc87-4e78-9bec-0e1239ff8c0b","user_phone":""}}', '2023-08-18 23:05:22.463233+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e6e610ee-9f70-455f-9e31-bb40bf797423', '{"action":"user_confirmation_requested","actor_id":"754b0e76-35ae-411e-9ee0-ea60d3fb4864","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2023-08-18 23:06:01.027696+00', ''),
	('00000000-0000-0000-0000-000000000000', '37354f3c-5e5e-49b3-b8b1-2a5c4195ebe2', '{"action":"user_signedup","actor_id":"754b0e76-35ae-411e-9ee0-ea60d3fb4864","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"team"}', '2023-08-18 23:06:12.473963+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c6e0dd93-b0c5-4769-ab4d-8f809a77c642', '{"action":"login","actor_id":"754b0e76-35ae-411e-9ee0-ea60d3fb4864","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2023-08-18 23:06:28.727517+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b07b695f-6920-421b-9b05-9723d6f6208f', '{"action":"logout","actor_id":"754b0e76-35ae-411e-9ee0-ea60d3fb4864","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"account"}', '2023-08-18 23:06:33.45947+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a0670543-0357-46fa-b65f-3e96beac771f', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"36bend@gmail.com","user_id":"754b0e76-35ae-411e-9ee0-ea60d3fb4864","user_phone":""}}', '2023-08-18 23:08:03.928566+00', ''),
	('00000000-0000-0000-0000-000000000000', '3267b7aa-be09-49f8-a2be-dcdb0b558df2', '{"action":"user_confirmation_requested","actor_id":"20a578de-e48e-4dc5-8a55-4ecadca22e05","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2023-08-18 23:09:01.26198+00', ''),
	('00000000-0000-0000-0000-000000000000', '6f3dee01-f602-4357-b33a-71dd7f974a32', '{"action":"user_signedup","actor_id":"20a578de-e48e-4dc5-8a55-4ecadca22e05","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"team"}', '2023-08-18 23:09:07.62495+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f2766421-3a6f-4df2-9e56-ce6dabb6c02d', '{"action":"login","actor_id":"20a578de-e48e-4dc5-8a55-4ecadca22e05","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2023-08-18 23:09:34.598632+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c2909424-5b7d-4186-8b1f-ab3f70683f2f', '{"action":"logout","actor_id":"20a578de-e48e-4dc5-8a55-4ecadca22e05","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"account"}', '2023-08-18 23:09:38.274652+00', ''),
	('00000000-0000-0000-0000-000000000000', '6354a478-857f-41a9-8b83-a4a150edf933', '{"action":"user_confirmation_requested","actor_id":"18ad68e6-24f4-4085-aaca-2dd021612a79","actor_username":"russell.shapiro10@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2023-08-18 23:11:18.372227+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd707a542-5c3d-4f4c-9050-178deb5468f2', '{"action":"user_signedup","actor_id":"18ad68e6-24f4-4085-aaca-2dd021612a79","actor_username":"russell.shapiro10@gmail.com","actor_via_sso":false,"log_type":"team"}', '2023-08-18 23:11:29.225022+00', ''),
	('00000000-0000-0000-0000-000000000000', '185a78c8-6316-4ee2-b351-6a772fcce608', '{"action":"login","actor_id":"18ad68e6-24f4-4085-aaca-2dd021612a79","actor_username":"russell.shapiro10@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2023-08-18 23:11:52.423092+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b7c55b88-252e-4f5b-9dcd-afe46ace5da3', '{"action":"logout","actor_id":"18ad68e6-24f4-4085-aaca-2dd021612a79","actor_username":"russell.shapiro10@gmail.com","actor_via_sso":false,"log_type":"account"}', '2023-08-18 23:12:12.094793+00', ''),
	('00000000-0000-0000-0000-000000000000', '922941b0-a58c-4cda-bdfd-94c7972c9542', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"russell.shapiro10@gmail.com","user_id":"18ad68e6-24f4-4085-aaca-2dd021612a79","user_phone":""}}', '2023-08-18 23:12:29.221742+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bd6347cb-fa6e-496e-9494-d7d099815711', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"36bend@gmail.com","user_id":"20a578de-e48e-4dc5-8a55-4ecadca22e05","user_phone":""}}', '2023-08-18 23:21:25.237488+00', ''),
	('00000000-0000-0000-0000-000000000000', '381a7c6b-9c09-499e-9f4e-8a9b6aa4ffb6', '{"action":"user_confirmation_requested","actor_id":"6b8e30d0-5af7-479f-85d9-dc300f0190b9","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2023-08-18 23:21:48.517949+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac47319a-4e14-4326-adb9-8b9ee00b7da6', '{"action":"user_signedup","actor_id":"6b8e30d0-5af7-479f-85d9-dc300f0190b9","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"team"}', '2023-08-18 23:21:56.201978+00', ''),
	('00000000-0000-0000-0000-000000000000', '06d45152-4d1f-486e-b28f-31be0774634b', '{"action":"login","actor_id":"6b8e30d0-5af7-479f-85d9-dc300f0190b9","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"email"}}', '2023-08-18 23:22:01.800304+00', ''),
	('00000000-0000-0000-0000-000000000000', '6a4455d5-a4f0-433f-b284-f6a2484e283f', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"36bend@gmail.com","user_id":"6b8e30d0-5af7-479f-85d9-dc300f0190b9","user_phone":""}}', '2023-08-18 23:25:59.239683+00', ''),
	('00000000-0000-0000-0000-000000000000', '94466d6e-4f7d-4e96-942b-107b039b26fa', '{"action":"user_confirmation_requested","actor_id":"fe2d23c0-051b-4df9-aef6-7364f43ddbc3","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2023-08-18 23:26:11.727155+00', ''),
	('00000000-0000-0000-0000-000000000000', '608c3cd7-9df5-4b65-a629-2b14e68c8589', '{"action":"user_signedup","actor_id":"fe2d23c0-051b-4df9-aef6-7364f43ddbc3","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"team"}', '2023-08-18 23:26:20.945985+00', ''),
	('00000000-0000-0000-0000-000000000000', '7bcf2d75-2eea-4636-a72b-cfd4a52d23a3', '{"action":"login","actor_id":"fe2d23c0-051b-4df9-aef6-7364f43ddbc3","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"email"}}', '2023-08-18 23:26:52.54117+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ee64363c-baeb-4a73-8951-82bb492af3f8', '{"action":"user_confirmation_requested","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2023-08-19 00:02:36.139173+00', ''),
	('00000000-0000-0000-0000-000000000000', '4523fa7d-54a0-40e7-bc3f-074fdbe90b06', '{"action":"user_signedup","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"team"}', '2023-08-19 00:02:52.555475+00', ''),
	('00000000-0000-0000-0000-000000000000', '60c4d026-03c7-4949-9a1e-dbb73d2e700b', '{"action":"login","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2023-08-19 00:02:58.61524+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e8b290bc-b16f-411d-96f5-75b24807b209', '{"action":"logout","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"account"}', '2023-08-19 00:15:25.435622+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b00857ce-fe99-4466-b169-d19e635185da', '{"action":"login","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2023-08-19 00:15:31.136219+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b69ebc37-3f54-4020-b402-d88006be0630', '{"action":"token_refreshed","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-19 13:51:24.043553+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c1081edf-a016-40a8-a52f-46b1c36261ba', '{"action":"token_revoked","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-19 13:51:24.045432+00', ''),
	('00000000-0000-0000-0000-000000000000', 'be5ec786-b5ee-4acc-8497-7e9d8ae4354c', '{"action":"token_refreshed","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-19 14:51:31.80941+00', ''),
	('00000000-0000-0000-0000-000000000000', '5b88d9ed-218b-429c-aad5-4b531e4cd6f9', '{"action":"token_revoked","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-19 14:51:31.810119+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fe0fecf0-378b-4a81-ba0c-74c30191c2e3', '{"action":"token_refreshed","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-19 15:53:49.881746+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b2709d5a-f9f9-42df-bf57-86947f0f5dc6', '{"action":"token_revoked","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-19 15:53:49.882555+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e5de5c68-15e1-400a-bcb2-647143259376', '{"action":"token_refreshed","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-19 16:52:04.228945+00', ''),
	('00000000-0000-0000-0000-000000000000', '6afe5ee2-d495-4fb7-b684-d505758492d7', '{"action":"token_revoked","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-19 16:52:04.229626+00', ''),
	('00000000-0000-0000-0000-000000000000', '4e0f2294-8eca-4dcb-b218-e02dd0946e92', '{"action":"token_refreshed","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-19 17:50:19.80995+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cc63fe2f-dc41-45f2-8b3a-e752f6389441', '{"action":"token_revoked","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-19 17:50:19.810857+00', ''),
	('00000000-0000-0000-0000-000000000000', '06809e16-447c-4427-a7c4-c01b5d22cdc4', '{"action":"token_refreshed","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-19 19:11:30.784323+00', ''),
	('00000000-0000-0000-0000-000000000000', '8651aee5-44ea-415d-bb59-09064081e3ad', '{"action":"token_revoked","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-19 19:11:30.78496+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a5d1911c-4079-4c8a-a325-908b0d8f92a6', '{"action":"token_refreshed","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-20 05:29:28.160001+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ad7a5182-4da1-419d-a2f1-b22093ae764e', '{"action":"token_revoked","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-20 05:29:28.160647+00', ''),
	('00000000-0000-0000-0000-000000000000', '09fc6947-663b-4e9c-a913-4dfca3a1de22', '{"action":"token_refreshed","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-20 17:12:31.834947+00', ''),
	('00000000-0000-0000-0000-000000000000', '45c6418d-9452-47f6-84d7-46fca8150c32', '{"action":"token_revoked","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-20 17:12:31.835608+00', ''),
	('00000000-0000-0000-0000-000000000000', '1d88bebb-b00d-482f-a6be-d949ec05677c', '{"action":"token_refreshed","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-20 18:31:57.999899+00', ''),
	('00000000-0000-0000-0000-000000000000', '15592837-c230-410b-ba14-843178e49623', '{"action":"token_revoked","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-20 18:31:58.000752+00', ''),
	('00000000-0000-0000-0000-000000000000', '67d5ba17-42e5-46cf-b463-a0d24b882220', '{"action":"token_refreshed","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-20 19:30:26.855458+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c5d07e07-e8bd-4c61-a43b-1ab4f99d8566', '{"action":"token_revoked","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-20 19:30:26.856123+00', ''),
	('00000000-0000-0000-0000-000000000000', '643d486f-c643-4773-b830-03ca254471cb', '{"action":"token_refreshed","actor_id":"fe2d23c0-051b-4df9-aef6-7364f43ddbc3","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-20 21:29:24.137804+00', ''),
	('00000000-0000-0000-0000-000000000000', '5d6541b0-15c7-41ad-bea1-4d30d6e8020c', '{"action":"token_revoked","actor_id":"fe2d23c0-051b-4df9-aef6-7364f43ddbc3","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-20 21:29:24.141468+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd33fcb8b-99f8-4386-9977-5b8aa35de5e7', '{"action":"logout","actor_id":"fe2d23c0-051b-4df9-aef6-7364f43ddbc3","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"account"}', '2023-08-20 21:30:05.019584+00', ''),
	('00000000-0000-0000-0000-000000000000', '6377fd45-7fab-4e3d-8dad-a6d472d5fb8a', '{"action":"token_refreshed","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-20 23:32:12.626901+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cf439e39-77c9-47c2-b6ba-2a6fa8ae3697', '{"action":"token_revoked","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-20 23:32:12.627525+00', ''),
	('00000000-0000-0000-0000-000000000000', '3d70edfe-6c23-41c9-a866-0fef0922c0e0', '{"action":"token_refreshed","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-21 00:30:37.043487+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c339612b-69a6-4e93-9d8c-ee26a728b1f3', '{"action":"token_revoked","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-21 00:30:37.044247+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bb25430f-3563-4a21-a2af-a6f385789dcd', '{"action":"token_refreshed","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-21 01:46:49.645975+00', ''),
	('00000000-0000-0000-0000-000000000000', '4e6b1cc2-4000-453b-95fa-290812fb1aa1', '{"action":"token_revoked","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-21 01:46:49.646704+00', ''),
	('00000000-0000-0000-0000-000000000000', '1fd946bf-7442-4361-82bc-5e742e2513b2', '{"action":"token_refreshed","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-21 02:47:03.085621+00', ''),
	('00000000-0000-0000-0000-000000000000', '426ba276-28c6-4aa8-8893-2cc7b50fc01f', '{"action":"token_revoked","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-21 02:47:03.086198+00', ''),
	('00000000-0000-0000-0000-000000000000', '470af34b-ddf6-4c3e-8b8e-f8ae33fe8591', '{"action":"login","actor_id":"fe2d23c0-051b-4df9-aef6-7364f43ddbc3","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2023-08-21 22:53:01.485063+00', ''),
	('00000000-0000-0000-0000-000000000000', '04862336-e0a7-45b9-9054-8b798efd1561', '{"action":"logout","actor_id":"fe2d23c0-051b-4df9-aef6-7364f43ddbc3","actor_username":"36bend@gmail.com","actor_via_sso":false,"log_type":"account"}', '2023-08-21 22:55:10.587512+00', ''),
	('00000000-0000-0000-0000-000000000000', '925f9e7c-9955-45f1-b596-576b852926f7', '{"action":"token_refreshed","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-21 23:25:45.089524+00', ''),
	('00000000-0000-0000-0000-000000000000', '47fca9aa-90e0-44b8-b668-ed9b552a9a28', '{"action":"token_revoked","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-21 23:25:45.090155+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e9d72973-6289-4f99-982a-2304001670f1', '{"action":"token_refreshed","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-22 01:07:37.634636+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c7b5843c-a6a6-4a07-bde2-511bd6c5167a', '{"action":"token_revoked","actor_id":"f6fb82db-935e-485b-b32b-a9d7ddb19e5f","actor_username":"jacksonshapiro11@gmail.com","actor_via_sso":false,"log_type":"token"}', '2023-08-22 01:07:37.635407+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method") VALUES
	('d7d5b933-b730-4d80-b467-1480687955b6', 'e2e05c6d-1133-40fe-9fe3-c207bccb2cdb', '566d0114-6060-4246-8846-bffd9d7024e0', 's256', 'HAEcE8xtNZsH0L-CnZkKY3ER_GkKzyeI1k12jN6Sv0M', 'email', '', '', '2023-08-18 04:19:29.833595+00', '2023-08-18 04:19:29.833595+00', 'email/signup'),
	('9fe3611a-8764-40f6-8312-cb1eba6bda4f', '00e0c983-4b83-464e-90a3-a96c0d8236f5', 'b81c1f1f-4871-43c4-9166-f79e59ae6091', 's256', '6b-PmTv-UabMYY5bH-EDpW7GuL_tC_88Mg3vVK-rOAs', 'email', '', '', '2023-08-18 04:26:18.306675+00', '2023-08-18 04:26:18.306675+00', 'email/signup'),
	('30b80b6c-aa67-488b-a6c9-eb174611ca2b', '3f496729-a687-4765-9ca8-ced6f660f813', 'ff1b081c-08b7-4295-ab60-6e21589810d3', 's256', 'hr2LkMPdKwo-1Me42eMSs7VFM4uObN_H8WFZsWrXAHs', 'email', '', '', '2023-08-18 04:31:25.418199+00', '2023-08-18 04:31:25.418199+00', 'email/signup'),
	('5e61da36-ca49-4485-9e35-f22505e32b76', '864262f9-bc87-4e78-9bec-0e1239ff8c0b', '9bfb7e7f-348c-4191-8a88-8e21f1437d38', 's256', 'mGUuxeo_10oE4jLj0TlmKm2MzoI4pgBtC7hdZISfZB4', 'email', '', '', '2023-08-18 05:07:13.950594+00', '2023-08-18 05:07:13.950594+00', 'email/signup'),
	('e865f821-f73e-4207-aa98-0bc4398abfb0', '754b0e76-35ae-411e-9ee0-ea60d3fb4864', '35573b6c-389e-4cbb-8198-33a5fd61cd2c', 's256', 'znCSa3PLZZ1dxI2NAQzH9pLGdDgIq1880JGFKzGI8GY', 'email', '', '', '2023-08-18 23:06:01.028352+00', '2023-08-18 23:06:01.028352+00', 'email/signup'),
	('8f3e0710-b9a0-4e58-8d4e-f1b52d736975', '20a578de-e48e-4dc5-8a55-4ecadca22e05', '5fd4581a-e8c9-4549-86b0-882445ed3231', 's256', 'RFaYIVkf_Biq-AJGuibrhKR0Fw1OVAT1L4X6AIpm1XU', 'email', '', '', '2023-08-18 23:09:01.262567+00', '2023-08-18 23:09:01.262567+00', 'email/signup'),
	('24918ab2-f77b-4455-889f-4b2fa082fc10', '18ad68e6-24f4-4085-aaca-2dd021612a79', '72b2c010-9fac-46d8-9239-16551c286497', 's256', 'w3lMof21qvja_CMDtWkQSzrl6Dzmpdfv4oh778dDFQU', 'email', '', '', '2023-08-18 23:11:18.372788+00', '2023-08-18 23:11:18.372788+00', 'email/signup'),
	('55ea94d0-23c2-4c87-8181-b810ad08a274', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', 'c191b657-9114-4b38-ae64-6e8c2eb4dae8', 's256', 'N4P23_qE0X8kRtBBkk3FstsjMQhva2yT4GTl9u27Aco', 'email', '', '', '2023-08-19 00:02:36.140971+00', '2023-08-19 00:02:36.140971+00', 'email/signup');


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at") VALUES
	('00000000-0000-0000-0000-000000000000', 'fe2d23c0-051b-4df9-aef6-7364f43ddbc3', 'authenticated', 'authenticated', '36bend@gmail.com', '$2a$10$szQYS7fUGDcpzWiLKQXE2efmCWKrDS6J63GVMidsAc0H52URgTyTW', '2023-08-18 23:26:20.946633+00', NULL, '', '2023-08-18 23:26:11.728355+00', '', NULL, '', '', NULL, '2023-08-21 22:53:01.485766+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2023-08-18 23:26:11.723956+00', '2023-08-21 22:53:01.490069+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL),
	('00000000-0000-0000-0000-000000000000', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', 'authenticated', 'authenticated', 'jacksonshapiro11@gmail.com', '$2a$10$UKX2VWJDhXADqukiNNsDiuyIJCLoSxsrgCNpP83i4RclPr5y9JknS', '2023-08-19 00:02:52.556042+00', NULL, '', '2023-08-19 00:02:36.142091+00', '', NULL, '', '', NULL, '2023-08-19 00:15:31.136897+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2023-08-19 00:02:36.134729+00', '2023-08-22 01:07:37.638769+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at") VALUES
	('fe2d23c0-051b-4df9-aef6-7364f43ddbc3', 'fe2d23c0-051b-4df9-aef6-7364f43ddbc3', '{"sub": "fe2d23c0-051b-4df9-aef6-7364f43ddbc3", "email": "36bend@gmail.com"}', 'email', '2023-08-18 23:26:11.726332+00', '2023-08-18 23:26:11.72637+00', '2023-08-18 23:26:11.72637+00'),
	('f6fb82db-935e-485b-b32b-a9d7ddb19e5f', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', '{"sub": "f6fb82db-935e-485b-b32b-a9d7ddb19e5f", "email": "jacksonshapiro11@gmail.com"}', 'email', '2023-08-19 00:02:36.138243+00', '2023-08-19 00:02:36.138278+00', '2023-08-19 00:02:36.138278+00');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after") VALUES
	('a1c26058-dcd3-402e-bf42-d535f33eb7b1', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', '2023-08-19 00:15:31.136951+00', '2023-08-19 00:15:31.136951+00', NULL, 'aal1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('a1c26058-dcd3-402e-bf42-d535f33eb7b1', '2023-08-19 00:15:31.139615+00', '2023-08-19 00:15:31.139615+00', 'password', '8c674f66-5d66-4786-a2a6-25b89766ea88');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 10, 'z0140kQTcSVn7h60VRKYDg', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', true, '2023-08-19 00:15:31.137655+00', '2023-08-19 13:51:24.046095+00', NULL, 'a1c26058-dcd3-402e-bf42-d535f33eb7b1'),
	('00000000-0000-0000-0000-000000000000', 11, 'U2Kjg5wDmV2hQCKpkIswVQ', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', true, '2023-08-19 13:51:24.048315+00', '2023-08-19 14:51:31.810772+00', 'z0140kQTcSVn7h60VRKYDg', 'a1c26058-dcd3-402e-bf42-d535f33eb7b1'),
	('00000000-0000-0000-0000-000000000000', 12, 'Vumbx4IG3pGdm09rzVDUIA', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', true, '2023-08-19 14:51:31.811195+00', '2023-08-19 15:53:49.883188+00', 'U2Kjg5wDmV2hQCKpkIswVQ', 'a1c26058-dcd3-402e-bf42-d535f33eb7b1'),
	('00000000-0000-0000-0000-000000000000', 13, 'UNE810FQdSW0-kmVpuGs7A', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', true, '2023-08-19 15:53:49.883559+00', '2023-08-19 16:52:04.230267+00', 'Vumbx4IG3pGdm09rzVDUIA', 'a1c26058-dcd3-402e-bf42-d535f33eb7b1'),
	('00000000-0000-0000-0000-000000000000', 14, 'RZyrrLh4OBb21IUJ6psFuw', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', true, '2023-08-19 16:52:04.230713+00', '2023-08-19 17:50:19.811473+00', 'UNE810FQdSW0-kmVpuGs7A', 'a1c26058-dcd3-402e-bf42-d535f33eb7b1'),
	('00000000-0000-0000-0000-000000000000', 15, 'DNXyHICRitd23sRqQa4SsQ', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', true, '2023-08-19 17:50:19.81192+00', '2023-08-19 19:11:30.785454+00', 'RZyrrLh4OBb21IUJ6psFuw', 'a1c26058-dcd3-402e-bf42-d535f33eb7b1'),
	('00000000-0000-0000-0000-000000000000', 16, 'dagAmimhgjdaHd7Z3JPtLQ', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', true, '2023-08-19 19:11:30.785788+00', '2023-08-20 05:29:28.161136+00', 'DNXyHICRitd23sRqQa4SsQ', 'a1c26058-dcd3-402e-bf42-d535f33eb7b1'),
	('00000000-0000-0000-0000-000000000000', 17, '4t9aEwOdCMEhKLh0Pz8A3Q', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', true, '2023-08-20 05:29:28.16144+00', '2023-08-20 17:12:31.836175+00', 'dagAmimhgjdaHd7Z3JPtLQ', 'a1c26058-dcd3-402e-bf42-d535f33eb7b1'),
	('00000000-0000-0000-0000-000000000000', 18, 'etfcmUtNFY6C1fXJ1bsmZg', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', true, '2023-08-20 17:12:31.836479+00', '2023-08-20 18:31:58.001457+00', '4t9aEwOdCMEhKLh0Pz8A3Q', 'a1c26058-dcd3-402e-bf42-d535f33eb7b1'),
	('00000000-0000-0000-0000-000000000000', 19, 'xRWSFYPVTyxugvp8OU9G0w', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', true, '2023-08-20 18:31:58.001875+00', '2023-08-20 19:30:26.856838+00', 'etfcmUtNFY6C1fXJ1bsmZg', 'a1c26058-dcd3-402e-bf42-d535f33eb7b1'),
	('00000000-0000-0000-0000-000000000000', 20, 'U6SQGp_MkCNK52AECD-qAQ', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', true, '2023-08-20 19:30:26.857145+00', '2023-08-20 23:32:12.628146+00', 'xRWSFYPVTyxugvp8OU9G0w', 'a1c26058-dcd3-402e-bf42-d535f33eb7b1'),
	('00000000-0000-0000-0000-000000000000', 22, '-lN-cHgDrvvhJZtDVEpLag', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', true, '2023-08-20 23:32:12.628436+00', '2023-08-21 00:30:37.044838+00', 'U6SQGp_MkCNK52AECD-qAQ', 'a1c26058-dcd3-402e-bf42-d535f33eb7b1'),
	('00000000-0000-0000-0000-000000000000', 23, 'ibx4TuMYlbtBXyv2sZ_itA', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', true, '2023-08-21 00:30:37.045127+00', '2023-08-21 01:46:49.647265+00', '-lN-cHgDrvvhJZtDVEpLag', 'a1c26058-dcd3-402e-bf42-d535f33eb7b1'),
	('00000000-0000-0000-0000-000000000000', 24, 'L2hJ1HokhQ6nYxfr2VScqg', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', true, '2023-08-21 01:46:49.647634+00', '2023-08-21 02:47:03.086666+00', 'ibx4TuMYlbtBXyv2sZ_itA', 'a1c26058-dcd3-402e-bf42-d535f33eb7b1'),
	('00000000-0000-0000-0000-000000000000', 25, 'pC4hmQSKDjevsMZqEmv79g', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', true, '2023-08-21 02:47:03.086995+00', '2023-08-21 23:25:45.09081+00', 'L2hJ1HokhQ6nYxfr2VScqg', 'a1c26058-dcd3-402e-bf42-d535f33eb7b1'),
	('00000000-0000-0000-0000-000000000000', 27, 'R2btNdmlrGRcdk_Xit2w6A', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', true, '2023-08-21 23:25:45.091289+00', '2023-08-22 01:07:37.635962+00', 'pC4hmQSKDjevsMZqEmv79g', 'a1c26058-dcd3-402e-bf42-d535f33eb7b1'),
	('00000000-0000-0000-0000-000000000000', 28, 'Fp1kcS_v3b14vWJIiKxWGg', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', false, '2023-08-22 01:07:37.636991+00', '2023-08-22 01:07:37.636991+00', 'R2btNdmlrGRcdk_Xit2w6A', 'a1c26058-dcd3-402e-bf42-d535f33eb7b1');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."events" ("id", "created_at", "updated_at", "name", "description", "date", "location", "image") VALUES
	('23291130-dd3c-4dd4-8f75-51f7d79d58c9', '2023-08-21 22:53:33.281182+00', '2023-08-21 22:53:33.281182+00', 'No prisma', 'alsdkhfjjlaksdjflkajsdflkjasdflasdfasdf', '2023-08-24 12:30:00+00', 'asdfasd', 'https://gclzfhnchcgtgcmzpvna.supabase.co/storage/v1/object/public/images/event/drake.webp-00d075d3-05aa-4307-bc47-4dea004f7a22');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types") VALUES
	('images', 'images', NULL, '2023-08-14 19:25:16.763787+00', '2023-08-14 19:25:16.763787+00', true, false, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version") VALUES
	('d176be8f-70ad-46be-b2ab-51dca8ae7633', 'images', 'event/drake.webp-00d075d3-05aa-4307-bc47-4dea004f7a22', 'fe2d23c0-051b-4df9-aef6-7364f43ddbc3', '2023-08-21 22:53:15.121528+00', '2023-08-21 22:53:15.272126+00', '2023-08-21 22:53:15.121528+00', '{"eTag": "\"7378bfba4e3df7fcd1acabf7ef8e27e8\"", "size": 731536, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2023-08-21T22:53:16.000Z", "contentLength": 731536, "httpStatusCode": 200}', NULL),
	('b96245cd-d027-49f0-8350-258fbf7790b0', 'images', 'event/Janis-Joplin.webp-a8fb3bdd-bfba-4f5c-9aa3-62033aeb0b34', 'f6fb82db-935e-485b-b32b-a9d7ddb19e5f', '2023-08-19 00:05:06.034729+00', '2023-08-19 00:05:06.29456+00', '2023-08-19 00:05:06.034729+00', '{"eTag": "\"f84c0569983bb04cb1a27a8e215eb48a\"", "size": 333188, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2023-08-19T00:05:07.000Z", "contentLength": 333188, "httpStatusCode": 200}', NULL),
	('5a2d4a13-b1d9-4a91-86cc-cd1dac0e33d2', 'images', 'event/jimi.jpeg-2f302f7e-1041-4fe8-9822-c5cfa4c1093c', NULL, '2023-08-16 17:50:00.623221+00', '2023-08-16 17:50:00.776212+00', '2023-08-16 17:50:00.623221+00', '{"eTag": "\"dc1bc25b2f20471ea27d9b565b907e02\"", "size": 306183, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2023-08-16T17:50:01.000Z", "contentLength": 306183, "httpStatusCode": 200}', NULL),
	('4551e4aa-5045-4753-921c-1d086b7880ae', 'images', '.emptyFolderPlaceholder', NULL, '2023-08-16 04:14:43.495804+00', '2023-08-16 04:14:43.576383+00', '2023-08-16 04:14:43.495804+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2023-08-16T04:14:44.000Z", "contentLength": 0, "httpStatusCode": 200}', NULL),
	('e81ed709-ef88-4dbd-bd9f-4a9ccb6d3498', 'images', 'event/jimi.jpeg-1030cc32-f7e6-4eff-836d-b6cfb4a6cdf9', NULL, '2023-08-16 17:47:40.681961+00', '2023-08-16 17:47:40.988884+00', '2023-08-16 17:47:40.681961+00', '{"eTag": "\"dc1bc25b2f20471ea27d9b565b907e02\"", "size": 306183, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2023-08-16T17:47:41.000Z", "contentLength": 306183, "httpStatusCode": 200}', NULL),
	('8195e205-46cc-4306-9440-407bd7918337', 'images', 'event/jimi.jpeg-c1c08f23-c0bd-45d1-bf7e-5d9f6a60b4a4', NULL, '2023-08-16 17:54:27.597365+00', '2023-08-16 17:54:27.69514+00', '2023-08-16 17:54:27.597365+00', '{"eTag": "\"dc1bc25b2f20471ea27d9b565b907e02\"", "size": 306183, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2023-08-16T17:54:28.000Z", "contentLength": 306183, "httpStatusCode": 200}', NULL),
	('fcc42bc6-9299-411a-b190-f1be4835cfc5', 'images', 'event/drake.webp-a584e255-ba57-4cd0-b02c-75ea33ffad18', NULL, '2023-08-16 18:02:38.462644+00', '2023-08-16 18:02:38.740879+00', '2023-08-16 18:02:38.462644+00', '{"eTag": "\"7378bfba4e3df7fcd1acabf7ef8e27e8\"", "size": 731536, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2023-08-16T18:02:39.000Z", "contentLength": 731536, "httpStatusCode": 200}', NULL),
	('4a08f068-5ca8-40af-97d5-ad2ca74208f5', 'images', 'event/jimi.jpeg-61a1a3e2-8ff4-4e57-be42-6e7660a19aaa', NULL, '2023-08-16 18:05:19.147315+00', '2023-08-16 18:05:19.439326+00', '2023-08-16 18:05:19.147315+00', '{"eTag": "\"dc1bc25b2f20471ea27d9b565b907e02\"", "size": 306183, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2023-08-16T18:05:20.000Z", "contentLength": 306183, "httpStatusCode": 200}', NULL);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 28, true);


--
-- Name: event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."event_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
