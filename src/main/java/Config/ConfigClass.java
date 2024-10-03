package Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ConfigClass implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Daj pristup svim API ruterima
                .allowedOrigins("http://localhost:4200") // Dozvoli samo ovu domenu
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Dozvoli metode
                .allowedHeaders("*") // Dozvoli sve heder-e
                .allowCredentials(true); // Ako je potrebno da šalješ kolačiće
    }
}
