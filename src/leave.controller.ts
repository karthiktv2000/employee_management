import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { leaveDto } from "./dto/leave.dto";
import { leave } from "./leave.schema";
import { leaveService } from "./leave.service";

@Controller()
export class leaveController {

    constructor(private leaveService: leaveService) { }

    public async leaves(req,res) {
        return this.leaveService.getAll(req,res);
  }
}