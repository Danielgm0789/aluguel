CREATE DATABASE Aluguel;

USE Aluguel;

CREATE TABLE cliente (
	cpf 					varchar(11) primary key,
    saldo					float(22,2) default 0
);

CREATE TABLE reserva (
	id						int primary key auto_increment,
    cpf_cliente 			varchar(11) not null,
    id_apartamento			int not null,
    data_entrada			date not null,
    data_saida				date not null,
    preco_total				float(22,2) not null
);

CREATE TABLE cancelar (
	id						int primary key auto_increment,
    id_reserva				int not null,
    cpf_cliente 			varchar(11) not null,
    id_apartamento			int not null,
    data_entrada			date not null,
    data_saida				date not null,
    preco_total				float(22,2) not null
);

CREATE TABLE apartamento (
	id						int primary key auto_increment,
    cpf_corretor			varchar(11) not null,
    local_apartamento		varchar(58) not null,
    quartos					int not null,
    banheiros				int not null,
    cozinha					varchar(3) not null,
    garagem					int not null,
    andar					int not null,
    elevador				varchar(3) not null,
    condominio				varchar(255),
    apartamento				int not null,
    portaria				varchar(3) not null,
    diaria					float(7,2) not null
);

delimiter //
create trigger insert_sum_sub before insert on reserva
for each row
begin
	set new.preco_total = (DATEDIFF(new.data_saida, new.data_entrada)) * (SELECT diaria FROM apartamento WHERE id = new.id_apartamento);

	update cliente
	set saldo = saldo + new.preco_total
    where cpf = (select cpf_corretor from apartamento where id = new.id_apartamento);
    
    update cliente
	set saldo = saldo - new.preco_total
    where cpf = new.cpf_cliente;
end;//
delimiter ;

delimiter //
create trigger insert_atualizar before insert on cancelar
for each row
begin
	update cliente
	set saldo = saldo + new.preco_total
    where cpf = new.cpf_cliente;

	update cliente
	set saldo = saldo - new.preco_total
    where cpf = (select cpf_corretor from apartamento where id = new.id_apartamento);
    
    DELETE FROM reserva WHERE id = new.id_reserva;
end;//
delimiter ;

alter table reserva 
add foreign key (cpf_cliente) references cliente (cpf);

alter table reserva
add foreign key (id_apartamento) references apartamento (id);

alter table cancelar 
add foreign key (cpf_cliente) references cliente (cpf);

alter table cancelar
add foreign key (id_apartamento) references apartamento (id);

alter table apartamento 
add foreign key (cpf_corretor) references cliente (cpf);

#Inserts Obrigatórios

insert into cliente (cpf, saldo)
values (1, 10000);

insert into cliente (cpf, saldo)
values (2, 10000);

insert into cliente (cpf, saldo)
values (3, 10000);

insert into cliente (cpf, saldo)
values (4, 10000);

insert into apartamento (cpf_corretor, local_apartamento, quartos, banheiros, cozinha, garagem, andar, elevador, condominio, apartamento, portaria, diaria)
values (1, 'Juiz de Fora - MG', 2, 2, 'SIM', 1, 4, 'SIM', 'Portal da Indepêndencia / Bloco B', 402, 'SIM', 250);

insert into apartamento (cpf_corretor, local_apartamento, quartos, banheiros, cozinha, garagem, andar, elevador, condominio, apartamento, portaria, diaria)
values (2, 'Rio de Janeiro - RJ', 1, 1, 'SIM', 0, 2, 'NÃO', 'Praia Rica', 201, 'NÃO', 110);

insert into apartamento (cpf_corretor, local_apartamento, quartos, banheiros, cozinha, garagem, andar, elevador, condominio, apartamento, portaria, diaria)
values (3, 'São Paulo - SP', 4, 3, 'SIM', 2, 16, 'SIM', 'Céu Limpo / Bloco A', 1601, 'SIM', 500);