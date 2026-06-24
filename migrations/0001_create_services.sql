create table statuses (
    id integer primary key,
    description text not null
);

create table services (
    id text primary key,
    name text not null,
    status integer not null,
    description text not null default 'No description provided',
    foreign key (status) references statuses(id)
);

insert into statuses (id, description) values
  (0, 'offline'),
  (1, 'online'),
  (2, 'local');

insert into services (id, name, status, description) values
  ('homeassistant', 'Home Assistant', 1, 'Main smart home dashboard and automation hub'),
  ('matter', 'Matter Server', 0, 'Matter controller service for Home Assistant'),
  ('otbr', 'OpenThread Border Router', 2, 'Thread network border router'),
  ('mosquitto', 'Mosquitto', 1, 'MQTT broker for local smart home messaging');
