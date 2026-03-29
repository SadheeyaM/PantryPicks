package sysco.com.cart.dto.request;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;


@Data
public class CartRequestDto {

    @NotNull(message = "User Id is required")
    @Positive(message = "User Id must be positive")
    private Integer userId;
}
