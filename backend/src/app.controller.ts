import { Controller, Get } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { AppService } from './app.service';
import allConfig from './config/allConfig';
import { Inject, Injectable } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/")
  getHello(): string {
    return this.appService.getHello();
  }
  // @Get("/email")
  // gw(): string {
  //   return this.config.baseUrl;
  // }
}
