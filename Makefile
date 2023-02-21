compose_file				=	docker-compose.yml
services					=	backend frontend db

all:						;	docker-compose --file $(compose_file) up --build --detach

%_up:						;	docker-compose --file $(compose_file) up $* --build --detach

%_it:						;	docker-compose --file $(compose_file) exec $* /bin/bash

%_stop:						;	docker-compose --file $(compose_file) stop $*

%_log:						;	docker-compose --file $(compose_file) logs $*

%_clean:	%_stop			;	docker-compose --file $(compose_file) rm $*

%_re:		%_clean %_up	;

stop:							$(foreach service, $(services), $(service)_stop)
clean:							$(foreach service, $(services), $(service)_clean)
fclean:		clean			;	docker system prune

re:			fclean all

.SECONDEXPANSION:
