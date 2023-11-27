import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards, Req } from "@nestjs/common";
import { EventException, EventsService } from "./events.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { instanceToPlain } from "class-transformer";
import { AuthGuard, Request } from "src/auth/auth.guard";

@ApiTags("events")
@ApiBearerAuth()
@Controller("events")
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post()
    @UseGuards(AuthGuard)
    async create(
        @Body() createEventDto: CreateEventDto,
        @Req() req: Request,
    ) {
        try {
            await this.eventsService.create(createEventDto, req.user.sub);
        } catch (e) {
            if (e instanceof EventException) {
                throw new HttpException(e.name, HttpStatus.BAD_REQUEST);
            }

            throw e;
        }
    }

    @Get()
    async findAll() {
        return instanceToPlain(await this.eventsService.findAll());
    }

    @Get("id/:id")
    async findOne(@Param("id") id: string) {
        try {
            return instanceToPlain(await this.eventsService.findOne(+id));
        } catch (e) {
            if (e instanceof EventException && e.name === "EVENT DOESNT EXIST") {
                throw new HttpException(e.name, HttpStatus.NOT_FOUND);
            }

            throw e;
        }
    }

    @Get("user/:username")
    async find(@Param("username") username: string) {
        return instanceToPlain(await this.eventsService.find(username));
    }

    @Patch(":id")
    @UseGuards(AuthGuard)
    update(
        @Param("id") id: string,
        @Body() updateEventDto: UpdateEventDto,
    ) {
        return this.eventsService.update(+id, updateEventDto);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    remove(@Param("id") id: string) {
        return this.eventsService.remove(+id);
    }
}