import {
  ArgumentMetadata,
  HttpException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { Country } from "@prisma/client";
import { z } from "zod";

@Injectable()
export class ParseQueryToCountriesArrayPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!value) {
      return;
    }

    const countries = value.split(",");
    const brokenCountries = [];
    for (const country of countries) {
      try {
        z.nativeEnum(Country).parse(country);
      } catch (e) {
        brokenCountries.push(country);
      }
    }

    if (brokenCountries.length) {
      throw new HttpException(
        `Invalid country code(s): ${brokenCountries.join(", ")}`,
        400,
      );
    }

    return countries as Country[];
  }
}
