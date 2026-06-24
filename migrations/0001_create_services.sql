CREATE TABLE Statuses (
    ID integer primary key,
    Description text not null
);

CREATE TABLE Services (
    ID text primary key,
    Name text not null,
    Status integer not null,
    Description text not null default 'No description provided',
    foreign key (Status) references Statuses(ID)
);

insert into Statuses (ID, Description) values
  (0, 'Offline'),
  (1, 'Online'),
  (2, 'Local Network Only'),
  (3, 'Disabled');

insert into Services (ID, Name, Status, Description) values
  ('homeassistant', 'Home Assistant', 1, 'Main smart home dashboard and automation hub'),
  ('matter', 'Matter Server', 0, 'Matter controller service for Home Assistant'),
  ('otbr', 'OpenThread Border Router', 2, 'Thread network border router'),
  ('mosquitto', 'Mosquitto', 1, 'MQTT broker for local smart home messaging');
